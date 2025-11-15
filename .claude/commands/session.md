# Session Planning Command

Create a new session plan using the workflow-enforced process.

## Process:
1. Start workflow-enforcer for session generation
2. Present 3-4 session structure options with:
   - Session type (linear tutorial, node-based, sandbox, dungeon crawl)
   - Primary focus (combat, social, exploration, mixed)
   - Structure options (skill challenge → dungeon → cutscene, etc.)
3. Get user selection
4. Generate session document following SESSION_FORMAT_SPEC.md
5. Show preview with collapsible sections and tiered DCs
6. Get approval
7. Save to Sessions/ directory and sync to Notion

## Parameters (all optional):
- **session_number**: Session number (required if not provided)
- **title**: Session title/theme
- **focus**: Main session focus (combat, social, exploration, mixed)
- **session_type**: linear | node-based | sandbox | dungeon-crawl

## Example Usage:
```
/session
/session session_number=2 title="Shadow Market" focus=social
/session session_number=3 session_type=dungeon-crawl
```
