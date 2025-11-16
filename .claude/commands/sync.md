Run complete synchronization pipeline: verify sync status and commit/push changes.

The pre-commit hook automatically handles Notion syncing intelligently (skips already-synced files).

Process:

1. **Verify Current Sync Status:**
   - Run: `python3 .config/verify_sync_status.py`
   - Reports local files vs Notion pages
   - Shows files needing sync

2. **Git Operations:**
   - Check status: `git status`
   - If changes exist:
     - Stage all: `git add .`
     - Commit: `git commit -m "sync: Sync campaign to Notion"`
     - Push: `git push` (in same command chain with commit)
   - Pre-commit hook will:
     - Check which files need syncing (based on mtime vs last push)
     - Sync only modified files to Notion
     - Auto-stage .notion_sync_state.json
   - Verify push succeeded

3. **Report Results:**
   - Files verified: X
   - Files synced by pre-commit: Y (only those needing sync)
   - Files skipped: Z (already synced)
   - Git changes committed: Yes/No
   - Git push status: Success/Failed
   - Notion database URL: https://notion.so/281693f0c6b480be87c3f56fef9cc2b9

Error Handling:
- If verify_sync_status.py fails, report error and stop
- If git push fails, report error and suggest checking network/permissions
- If no changes to commit, skip git operations and report "No changes"

Notes:
- Pre-commit hook intelligently skips already-synced files (checks mtime vs last push)
- .notion_sync_state.json automatically staged/committed by pre-commit hook
- File watcher (start_file_watcher.sh) should already be running for real-time sync
