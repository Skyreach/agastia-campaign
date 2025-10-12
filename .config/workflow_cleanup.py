#!/usr/bin/env python3
"""
Workflow Cleanup Script

Removes completed and stale workflows from .workflow_state.json
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
            print("ℹ️  No workflow state file found")
            return None

        with open(state_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading workflow state: {e}")
        return None

def save_workflow_state(state):
    """Save workflow state to file"""
    try:
        with open(WORKFLOW_STATE_FILE, 'w') as f:
            json.dump(state, f, indent=2)
        return True
    except Exception as e:
        print(f"❌ Error saving workflow state: {e}")
        return False

def parse_iso_timestamp(timestamp_str):
    """Parse ISO timestamp string to datetime"""
    try:
        if '.' in timestamp_str:
            return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        else:
            return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00').split('.')[0])
    except:
        return None

def cleanup_workflows(dry_run=False, max_age_days=7, remove_completed=False):
    """
    Clean up workflows from state file

    Args:
        dry_run: If True, show what would be removed without actually removing
        max_age_days: Maximum age in days for incomplete workflows
        remove_completed: If True, also remove completed workflows
    """
    state = load_workflow_state()

    if not state or 'workflows' not in state:
        print("✅ No workflows to clean up")
        return 0

    workflows = state['workflows']

    if not workflows:
        print("✅ No workflows to clean up")
        return 0

    # Categorize workflows for removal
    to_remove = []
    now = datetime.now()
    stale_threshold = timedelta(days=max_age_days)

    for workflow_id, workflow in workflows.items():
        # Completed workflows
        if 'completed_at' in workflow:
            if remove_completed:
                completed_at = parse_iso_timestamp(workflow.get('completed_at', ''))
                age_days = (now - completed_at).days if completed_at else None
                to_remove.append((workflow_id, workflow, f"Completed ({age_days} days ago)" if age_days else "Completed"))
            continue

        # Stale workflows (not completed, but old)
        created_at = parse_iso_timestamp(workflow.get('created_at', ''))
        if created_at and (now - created_at) > stale_threshold:
            age_days = (now - created_at).days
            to_remove.append((workflow_id, workflow, f"Stale ({age_days} days old)"))

    # Report what will be/was removed
    if not to_remove:
        print("✅ No workflows meet cleanup criteria")
        print(f"\nCriteria:")
        print(f"  • Incomplete workflows older than {max_age_days} days")
        if remove_completed:
            print(f"  • Completed workflows (any age)")
        else:
            print(f"  • Completed workflows: KEPT (use --remove-completed to clean)")
        return 0

    print("=" * 70)
    if dry_run:
        print("🔍 DRY RUN - Workflows that would be removed:")
    else:
        print("🗑️  REMOVING WORKFLOWS:")
    print("=" * 70)
    print()

    for workflow_id, workflow, reason in to_remove:
        workflow_type = workflow.get('type', 'unknown')
        current_stage = workflow.get('current_stage', 'unknown')
        created_at = workflow.get('created_at', 'unknown')

        print(f"   • {workflow_id}")
        print(f"     Type: {workflow_type}")
        print(f"     Stage: {current_stage}")
        print(f"     Created: {created_at}")
        print(f"     Reason: {reason}")
        print()

    print(f"Total: {len(to_remove)} workflows")
    print()

    if dry_run:
        print("=" * 70)
        print("🔍 DRY RUN COMPLETE - No changes made")
        print("=" * 70)
        print()
        print("To actually remove these workflows:")
        print(f"  python3 .config/workflow_cleanup.py --max-age {max_age_days}")
        if remove_completed:
            print("  (with --remove-completed flag)")
        return 0

    # Actually remove workflows
    for workflow_id, _, _ in to_remove:
        del state['workflows'][workflow_id]

    # Save updated state
    if save_workflow_state(state):
        print("=" * 70)
        print(f"✅ CLEANUP COMPLETE - Removed {len(to_remove)} workflows")
        print("=" * 70)
        print()
        remaining = len(state['workflows'])
        print(f"Remaining workflows: {remaining}")
        return 0
    else:
        print("❌ Failed to save updated workflow state")
        return 1

def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Clean up workflows from .workflow_state.json',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Dry run - see what would be removed
  python3 .config/workflow_cleanup.py --dry-run

  # Remove stale workflows older than 7 days
  python3 .config/workflow_cleanup.py

  # Remove stale workflows older than 3 days
  python3 .config/workflow_cleanup.py --max-age 3

  # Also remove completed workflows
  python3 .config/workflow_cleanup.py --remove-completed

  # Dry run with custom max age
  python3 .config/workflow_cleanup.py --dry-run --max-age 14
        """
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be removed without actually removing'
    )

    parser.add_argument(
        '--max-age',
        type=int,
        default=7,
        help='Maximum age in days for incomplete workflows (default: 7)'
    )

    parser.add_argument(
        '--remove-completed',
        action='store_true',
        help='Also remove completed workflows'
    )

    args = parser.parse_args()

    exit_code = cleanup_workflows(
        dry_run=args.dry_run,
        max_age_days=args.max_age,
        remove_completed=args.remove_completed
    )

    sys.exit(exit_code)

if __name__ == '__main__':
    main()
