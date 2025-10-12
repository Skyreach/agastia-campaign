#!/usr/bin/env python3
"""
Workflow Recovery Script

Checks for active workflows at session startup and prompts for recovery/continuation.
Used by SESSION_STARTUP_CHECK.sh to maintain workflow consistency across sessions.
"""

import json
import pathlib
import sys
from datetime import datetime, timedelta

WORKFLOW_STATE_FILE = '.workflow_state.json'

def load_workflow_state():
    """Load workflow state from file"""
    try:
        state_path = pathlib.Path(WORKFLOW_STATE_FILE)
        if not state_path.exists():
            return None

        with open(state_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️  Error loading workflow state: {e}", file=sys.stderr)
        return None

def parse_iso_timestamp(timestamp_str):
    """Parse ISO timestamp string to datetime"""
    try:
        # Handle both with and without microseconds
        if '.' in timestamp_str:
            return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        else:
            return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00').split('.')[0])
    except:
        return None

def check_active_workflows():
    """Check for active workflows and report status"""
    state = load_workflow_state()

    if not state or 'workflows' not in state:
        print("✅ No workflow state file found - starting fresh")
        return 0

    workflows = state['workflows']

    if not workflows:
        print("✅ No active workflows")
        return 0

    # Categorize workflows
    active_workflows = []
    completed_workflows = []
    stale_workflows = []

    now = datetime.now()
    stale_threshold = timedelta(days=7)  # 7 days

    for workflow_id, workflow in workflows.items():
        # Check if completed
        if 'completed_at' in workflow:
            completed_workflows.append((workflow_id, workflow))
            continue

        # Check if stale
        created_at = parse_iso_timestamp(workflow.get('created_at', ''))
        if created_at and (now - created_at) > stale_threshold:
            stale_workflows.append((workflow_id, workflow))
        else:
            active_workflows.append((workflow_id, workflow))

    # Report status
    if not active_workflows and not stale_workflows:
        print("✅ No active workflows")
        if completed_workflows:
            print(f"   ({len(completed_workflows)} completed workflows in state file)")
        return 0

    print("=" * 70)
    print("🔄 WORKFLOW RECOVERY")
    print("=" * 70)
    print()

    if active_workflows:
        print(f"📋 ACTIVE WORKFLOWS ({len(active_workflows)}):")
        print()
        for workflow_id, workflow in active_workflows:
            workflow_type = workflow.get('type', 'unknown')
            current_stage = workflow.get('current_stage', 'unknown')
            created_at = workflow.get('created_at', 'unknown')

            print(f"   • {workflow_id}")
            print(f"     Type: {workflow_type}")
            print(f"     Stage: {current_stage}")
            print(f"     Created: {created_at}")

            # Suggest next steps based on stage
            if current_stage == 'present_options':
                print(f"     ⚠️  Stuck in present_options - may need to present options again")
            elif current_stage == 'user_selection':
                print(f"     ⚠️  Waiting for user selection")
            elif current_stage == 'generate_content':
                print(f"     ⚠️  Ready to generate content")
            elif current_stage == 'user_approval':
                print(f"     ⚠️  Waiting for user approval")
            elif current_stage == 'save_content':
                print(f"     ⚠️  Ready to save content")

            print()

        print("💡 To continue a workflow:")
        print("   1. Use workflow-enforcer MCP: get_workflow_status(workflow_id)")
        print("   2. Review current stage and history")
        print("   3. Transition to next stage as needed")
        print()

    if stale_workflows:
        print(f"⏰ STALE WORKFLOWS ({len(stale_workflows)}):")
        print("   These workflows are older than 7 days and may be abandoned.")
        print()
        for workflow_id, workflow in stale_workflows:
            workflow_type = workflow.get('type', 'unknown')
            created_at = workflow.get('created_at', 'unknown')
            print(f"   • {workflow_id} ({workflow_type}) - created {created_at}")
        print()
        print("💡 To clean up stale workflows:")
        print("   python3 .config/workflow_cleanup.py --dry-run")
        print("   (Review what would be removed, then run without --dry-run)")
        print()

    print("=" * 70)
    print()

    # Return non-zero if there are workflows requiring attention
    return 1 if (active_workflows or stale_workflows) else 0

def main():
    """Main entry point"""
    exit_code = check_active_workflows()
    sys.exit(exit_code)

if __name__ == '__main__':
    main()
