# D&D Campaign Quick Commands

## Navigation
- `dnd` - Go to campaign directory and start Claude
- `cd /mnt/c/dnd` - Manual navigation

## Git Operations (SAFE - using mbourqu3@gmail.com)
- `git status` - Check changes
- `git add .` - Stage all changes
- `git commit -m "Session X updates"` - Commit changes
- `git push` - Push to GitHub

## Notion Sync
- `./sync_notion.py all` - Sync everything to Notion
- `./sync_notion.py Player_Characters/PC_Manny.md PC` - Sync specific file

## File Operations
- `ls -la` - List all files
- `find . -name "*.md" | grep -i "zero"` - Search for Professor Zero mentions
- `grep -r "Codex" --include="*.md"` - Search for Codex references

## Claude Operations
- Start Claude and it will auto-load the campaign context
- Ask Claude to "check CLAUDE.md" for navigation
- Request "update [filename]" to modify files

## Safety Checks (Built into CLAUDE.md)
- ✅ Git email verified: mbourqu3@gmail.com
- ✅ OS confirmed: WSL2 Ubuntu
- 🔒 Notion API key protection enabled
