#!/usr/bin/env python3
import json
import sys
import subprocess
import os

def check_unpushed_commits():
    """Check if there are unpushed commits in agastia-campaign repo"""
    repo_path = "/mnt/e/dnd/agastia-campaign"

    if not os.path.exists(os.path.join(repo_path, ".git")):
        return None

    try:
        # Check if there are unpushed commits
        result = subprocess.run(
            ["git", "-C", repo_path, "log", "@{u}..", "--oneline"],
            capture_output=True,
            text=True,
            timeout=2
        )

        if result.returncode == 0 and result.stdout.strip():
            commits = result.stdout.strip().split('\n')
            return f"{len(commits)} unpushed commit(s)"
        return None
    except:
        return None

unpushed = check_unpushed_commits()

context = ""
if unpushed:
    context = f"""
⚠️ CRITICAL: {unpushed} in agastia-campaign. You MUST push before continuing.
Run: git -C agastia-campaign push
"""

output = {
    "hookSpecificOutput": {
        "hookEventName": "Stop",
        "additionalContext": context
    }
}

print(json.dumps(output))
sys.exit(0)
