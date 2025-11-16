Pull session notes from Notion that were manually edited during play.

Process:
1. Run the pull script:
   ```bash
   cd /mnt/e/dnd/agastia-campaign && python3 .config/pull_session_notes.py
   ```

2. Review the output:
   - Shows all sessions found in Notion
   - Displays timestamp comparisons
   - Reports which sessions were updated

3. Check for file changes:
   ```bash
   cd /mnt/e/dnd/agastia-campaign && git status
   ```

4. If files were updated:
   - Show diff of changes to user
   - Ask if they want to commit
   - If yes, create commit with message: "docs: Pull session notes from Notion"
   - Push to remote

Important Notes:
- The script uses .notion_sync_state.json to track sync timestamps
- Only pulls if Notion was edited >1 hour after last push (avoids false positives)
- Preserves Notion's structure (user may have reorganized during session)
- Does NOT auto-commit (user must review changes first)

Error Handling:
- If no sessions found: Report and explain expected format
- If local file missing: Skip that session with warning
- If Notion API fails: Report error and suggest checking connection

Expected Output Format:
```
🔍 Searching Notion for session pages...

📋 Found 3 session page(s):
  Session 0: Session 0 - Character Creation & Campaign Setup
    Last edited: 2025-10-05T04:39:00+00:00
  Session 1: Session 1 - Ratterdan Investigation
    Last edited: 2025-10-18T14:23:00+00:00
  Session 2: Session 2 - Planning (WIP)
    Last edited: 2025-10-05T10:15:00+00:00

================================================================================
Checking which sessions need pulling...
================================================================================

📄 Session 1: Session_1_Caravan_to_Ratterdan.md
📊 Sessions/Session_1_Caravan_to_Ratterdan.md:
   Last pushed: 2025-10-05T14:39:44+00:00
   Notion edited: 2025-10-18T14:23:00+00:00
   Difference: 311.7 hours
   ✅ Difference > 1h, will pull
   Pulling from Notion...
   ✅ Updated Session_1_Caravan_to_Ratterdan.md
📥 Recorded pull: Notion → Sessions/Session_1_Caravan_to_Ratterdan.md at [timestamp]

================================================================================
✨ Pull complete: 1 updated, 2 skipped
================================================================================

⚠️  Remember to review changes and commit manually
   (No auto-commit to avoid sync loop)
```
