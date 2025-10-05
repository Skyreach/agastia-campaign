#!/bin/bash
# Start the file watcher in the background

cd "$(dirname "$0")"

# Check if already running
if pgrep -f "file_watcher.js" > /dev/null; then
    echo "✅ File watcher is already running"
    exit 0
fi

echo "🚀 Starting file watcher..."
nohup node .config/file_watcher.js > .config/file_watcher.log 2>&1 &

sleep 1

if pgrep -f "file_watcher.js" > /dev/null; then
    echo "✅ File watcher started successfully"
    echo "📋 Log file: .config/file_watcher.log"
    echo ""
    echo "To stop: pkill -f file_watcher.js"
else
    echo "❌ Failed to start file watcher"
    exit 1
fi
