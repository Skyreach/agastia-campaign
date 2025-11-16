Run complete synchronization pipeline: verify sync status, sync all files to Notion, and commit/push changes.

Process:

1. **Verify Current Sync Status:**
   - Run: `python3 .config/verify_sync_status.py`
   - Reports local files vs Notion pages
   - Shows files needing sync

2. **Sync All Files to Notion:**
   - Run: `.config/safe_resync_all.sh`
   - Syncs all campaign entities to Notion database
   - Updates existing pages (never deletes)
   - Categories: PCs, NPCs, Factions, Locations, Resources, Campaign Core, Sessions

3. **Verify Sync Completed:**
   - Run: `python3 .config/verify_sync_status.py` again
   - Confirm all files now synced
   - Report any remaining issues

4. **Git Operations:**
   - Check status: `git status`
   - If changes exist:
     - Stage all: `git add .`
     - Commit: `git commit -m "sync: Complete sync pipeline"`
     - Push: `git push` (in same command chain with commit)
   - Pre-commit hook will run and sync to Notion automatically
   - Verify push succeeded

5. **Report Results:**
   - Files verified: X
   - Files synced to Notion: Y
   - Git changes committed: Yes/No
   - Git push status: Success/Failed
   - Notion database URL: https://notion.so/281693f0c6b480be87c3f56fef9cc2b9

Error Handling:
- If verify_sync_status.py fails, report error and stop
- If safe_resync_all.sh fails, report which file failed and stop
- If git push fails, report error and suggest checking network/permissions
- If no changes to commit, skip git operations and report "No changes"

Notes:
- File watcher (start_file_watcher.sh) should already be running
- Pre-commit hook auto-syncs on every commit
- This command is for manual full sync verification
