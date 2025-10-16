#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Installing Claude Code Hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create .claude directory if it doesn't exist
mkdir -p "$CLAUDE_DIR"

# Copy hook scripts
echo "Copying hook scripts to $CLAUDE_DIR..."
cp "$SCRIPT_DIR/critical-behavior-hook.py" "$CLAUDE_DIR/"
cp "$SCRIPT_DIR/post-commit-push-reminder.py" "$CLAUDE_DIR/"
cp "$SCRIPT_DIR/stop-unpushed-check.py" "$CLAUDE_DIR/"

# Make scripts executable
echo "Making scripts executable..."
chmod +x "$CLAUDE_DIR/critical-behavior-hook.py"
chmod +x "$CLAUDE_DIR/post-commit-push-reminder.py"
chmod +x "$CLAUDE_DIR/stop-unpushed-check.py"

# Update settings.json
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "Updating $SETTINGS_FILE..."

if [ ! -f "$SETTINGS_FILE" ]; then
    echo "{}" > "$SETTINGS_FILE"
fi

# Create the hook configuration
cat > "$SETTINGS_FILE" <<EOF
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_DIR/critical-behavior-hook.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_DIR/post-commit-push-reminder.py"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_DIR/stop-unpushed-check.py"
          }
        ]
      }
    ]
  }
}
EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Hooks installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Installed hooks:"
echo "  • SessionStart: critical-behavior-hook.py"
echo "  • PostToolUse: post-commit-push-reminder.py"
echo "  • Stop: stop-unpushed-check.py"
echo ""
echo "Restart Claude Code for hooks to take effect."
echo ""
