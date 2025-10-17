#!/usr/bin/env python3
import json
import sys
import subprocess
import os

def check_unpushed_commits():
    """Check if there are unpushed commits in current git repo"""
    # Use git to find the repo root dynamically
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True,
            text=True,
            timeout=2
        )

        if result.returncode != 0:
            # Not in a git repo
            return None

        repo_path = result.stdout.strip()

        if not os.path.exists(os.path.join(repo_path, ".git")):
            return None

        # Check if there are unpushed commits
        result = subprocess.run(
            ["git", "log", "@{u}..", "--oneline"],
            cwd=repo_path,
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
⚠️ CRITICAL: {unpushed}. You MUST push before continuing.
Run: git push
"""

output = {
    "hookSpecificOutput": {
        "hookEventName": "Stop",
        "additionalContext": context
    }
}

print(json.dumps(output))
sys.exit(0)
