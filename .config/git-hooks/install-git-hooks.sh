#!/bin/bash
set -e

# Hardcoded paths to prevent nested directory issues
REPO_ROOT="/mnt/e/dnd/agastia-campaign"
SCRIPT_DIR="$REPO_ROOT/.config/git-hooks"
GIT_HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installing Git Hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ensure .git/hooks directory exists
mkdir -p "$GIT_HOOKS_DIR"

# Copy pre-commit hook
echo "Installing pre-commit hook..."
cp "$SCRIPT_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
chmod +x "$GIT_HOOKS_DIR/pre-commit"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Git hooks installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Installed hooks:"
echo "  • pre-commit: Format validation + Notion sync"
echo ""
echo "The pre-commit hook will:"
echo "  1. Block commits with duplicate file patterns (_v2, _FINAL, etc.)"
echo "  2. Validate entity file format compliance"
echo "  3. Sync modified files to Notion automatically"
echo ""
