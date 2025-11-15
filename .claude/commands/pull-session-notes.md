# Pull Session Notes Command

Pull manually-edited session notes from Notion and merge with local markdown files.

## Purpose:
When you take notes during a session directly in Notion (encounter stats, initiative order, etc.),
this command detects those changes and pulls them back to your local repository.

## How It Works:
1. Queries Notion for all session pages
2. Checks timestamps to detect manual edits (>1 hour after last automated sync)
3. Converts Notion blocks back to markdown
4. Merges with local files (preserves Notion structure)
5. Updates sync tracking state

## Important:
- Does NOT trigger git commit/push (to avoid sync loop)
- You must manually review and commit changes after pulling
- Only pulls sessions that have been edited in Notion significantly after last push

## Parameters:
None - automatically finds and pulls all updated sessions

## Example Usage:
```
/pull-session-notes
```

## Output:
- List of sessions found in Notion
- Timestamp comparison for each session
- Which sessions were pulled vs skipped
- Reminder to review and commit changes manually
