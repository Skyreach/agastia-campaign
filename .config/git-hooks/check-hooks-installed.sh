#!/bin/bash
# Check if git hooks are properly installed

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
GIT_HOOKS_DIR="$REPO_ROOT/.git/hooks"

# Exit codes
# 0 = all hooks installed
# 1 = hooks missing
# 2 = not in git repo

# Check if we're in a git repo
if [ ! -d "$REPO_ROOT/.git" ]; then
    echo "NOT_GIT_REPO"
    exit 2
fi

# Check for pre-commit hook
if [ ! -f "$GIT_HOOKS_DIR/pre-commit" ]; then
    echo "MISSING"
    exit 1
fi

# Check if hook is executable
if [ ! -x "$GIT_HOOKS_DIR/pre-commit" ]; then
    echo "NOT_EXECUTABLE"
    exit 1
fi

echo "INSTALLED"
exit 0
