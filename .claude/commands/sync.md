# Sync Command

Complete synchronization workflow: organize files, validate formats, sync to Notion, and push to GitHub.

## Process:
1. Run file-organizer to ensure proper directory structure
2. Run format-validator to check all entity files
3. Sync all changes to Notion database
4. Git add, commit, and push to remote

## What Gets Synced:
- All markdown files in campaign directories
- Entity format validation and auto-fixes
- Notion database updates (creates/updates pages)
- Git commits with sync metadata

## Parameters:
None - runs complete sync pipeline

## Example Usage:
```
/sync
```

## Output:
- File organization report
- Format validation results (with auto-fixes if needed)
- Notion sync status (files synced, pages created/updated)
- Git commit hash and push confirmation
