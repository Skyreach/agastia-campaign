Run complete synchronization pipeline: file organization, format validation, Notion sync, and git push.

Process:
1. File Organization (file-organizer MCP):
   - Check all files are in correct directories
   - Validate filename conventions
   - Report any misplaced files

2. Format Validation (format-validator MCP):
   - Run format_compliance_check on all entity files
   - Auto-fix common issues with auto_fix_format.py
   - Report any remaining violations

3. Notion Sync (dnd-campaign MCP):
   - Run sync_notion('all') to sync all markdown files
   - Creates/updates pages in Notion database
   - Verify sync with verify_sync_status.py

4. Git Operations (dnd-campaign MCP):
   - Run commit_and_push with message: "sync: Complete sync pipeline"
   - Auto-sync is enabled (will trigger Notion sync again via pre-commit hook)
   - Verify push succeeded

5. Report Results:
   - Files organized: X
   - Format issues fixed: Y
   - Notion pages synced: Z
   - Git commit: [hash]
   - Push status: Success/Failed

Error Handling:
- If format validation fails, report errors and stop
- If Notion sync fails, report but continue to git
- If git push fails, report and suggest manual resolution
