# Campaign Management MCP Servers

This directory contains Model Context Protocol (MCP) servers for automating campaign management based on frameworks from "So You Want to Be a Game Master" and "The Game Master's Book of Proactive Roleplaying".

## Available MCP Servers

### 1. Campaign Goals MCP
**Location:** `campaign-goals-mcp/`
**Purpose:** Manage PC/Faction/Patron goals with validation and tracking

**Features:**
- Create goals with Five Rules validation
- Track progress with progress clocks
- Find goal overlaps for natural conflicts
- Generate random goals from tables
- Filter and list goals by owner, status, timeframe

### 2. Factions & Patrons MCP
**Location:** `factions-patrons-mcp/`
**Purpose:** Living world simulation with faction conflicts and patron negotiations

**Features:**
- Create and manage factions (4 elements: identity, area, power, ideology)
- Track faction conflicts (procedural generation)
- Manage patrons linked to factions
- Generate patron negotiations based on PC goals
- Progress clock tracking for faction goals

### 3. Dynamic Dungeon MCP
**Location:** `dynamic-dungeon-mcp/`
**Purpose:** Living dungeon ecology with adversary rosters and dynamic encounters

**Features:**
- Manage adversary rosters separate from room keys
- Track action groups (Patrol/Mobile/Mostly Stationary/Stationary)
- Dungeon turn procedure automation
- Restocking procedures (zone-based)
- Faction territory integration

### 4. Mystery & Investigation MCP
**Location:** `mystery-investigation-mcp/`
**Purpose:** Node-based mystery design with Three Clue Rule enforcement

**Features:**
- Create revelation lists (conclusions PCs should reach)
- Three Clue Rule validation (3+ clues per revelation)
- Node-based design (locations/people/events)
- Clue tracking (found/missed/circled)
- Lead vs Evidence categorization
- Proactive clue suggestions

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup

1. **Navigate to the MCP server directory:**
```bash
cd agastia-campaign/Resources/MCP_Servers/campaign-goals-mcp
# (or whichever server you want to install)
```

2. **Install dependencies:**
```bash
npm install
```

3. **Repeat for each MCP server you want to use**

### Configuration with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "campaign-goals": {
      "command": "node",
      "args": [
        "/absolute/path/to/agastia-campaign/Resources/MCP_Servers/campaign-goals-mcp/index.js"
      ]
    },
    "factions-patrons": {
      "command": "node",
      "args": [
        "/absolute/path/to/agastia-campaign/Resources/MCP_Servers/factions-patrons-mcp/index.js"
      ]
    },
    "dynamic-dungeon": {
      "command": "node",
      "args": [
        "/absolute/path/to/agastia-campaign/Resources/MCP_Servers/dynamic-dungeon-mcp/index.js"
      ]
    },
    "mystery-investigation": {
      "command": "node",
      "args": [
        "/absolute/path/to/agastia-campaign/Resources/MCP_Servers/mystery-investigation-mcp/index.js"
      ]
    }
  }
}
```

**Important:** Replace `/absolute/path/to/` with your actual path!

### WSL Path Conversion (for Windows users using WSL)

If you're on Windows running WSL, convert paths like this:
```
WSL path: /mnt/e/dnd/agastia-campaign/...
Windows path: E:\dnd\agastia-campaign\...
```

Use the Windows path in your config.

## Data Storage

All data is stored in `agastia-campaign/Campaign_Data/`:
- `goals.json` - Goal tracking
- `factions.json` - Faction data
- `patrons.json` - Patron relationships
- `dungeons.json` - Dungeon rosters and state
- `mysteries.json` - Mystery nodes and revelations

This directory is automatically created on first use.

## Usage Examples

### Campaign Goals MCP

**Create a new PC goal:**
```
Create a goal for my character Nikki (PC):
- Goal: "Claim my ancestral bloodline's power"
- Time frame: long
- Success criteria: "Perform the Temporal Bloodline ritual and manifest time magic"
- Failure consequences: "The bloodline power goes dormant for another generation"
- Obstacles: ["Find the ritual components", "Locate family grimoire", "Survive the dangerous ritual"]
```

**List all active goals:**
```
List all active goals for my campaign
```

**Find goal overlaps:**
```
Find overlaps between PC goals to create natural conflicts
```

**Generate random goal:**
```
Generate a random goal for Faction: Red Orc Tribe
```

### Factions & Patrons MCP

**Create a faction:**
```
Create a faction:
- Name: "Cult of the Serpent"
- Archetype: Religious
- Power level: Moderate
- Territory: "Temple District, Underground Catacombs"
- Ideology: "Bring about the return of the Serpent God"
```

**Run faction conflict check:**
```
Check for faction conflicts this session
```

**Create a patron:**
```
Create a patron:
- Name: "Constable Harburk"
- Faction: "Town Watch"
- Resources: ["Manpower", "Local Authority", "Food Supplies"]
- Personality: ["Shrewd", "Kind-hearted", "Blunt"]
```

**Generate patron negotiation:**
```
Generate negotiation for Constable Harburk.
PC Goal: "Track down the bandits who robbed the caravan"
```

### Dynamic Dungeon MCP

**Create adversary roster:**
```
Create adversary roster for "Mephit Foundry" dungeon with the following action groups:
- 4 mud mephits in Area 1 (Mobile)
- 2 smoke + 1 steam mephit in Area 2 (Mobile)
- Work crew: 2 magmin + 2 mud mephits patrolling Areas 8-10
```

**Move action group:**
```
Move action group #2 (steam mephit group) from Area 2 to Area 10 (fleeing to alert boss)
```

**Run restocking check:**
```
Run restocking check for Mephit Foundry, Zone 1 (PCs cleared this zone last session)
```

### Mystery & Investigation MCP

**Create mystery:**
```
Create a mystery: "Who killed Lord Denton?"
```

**Add revelation:**
```
Add revelation to mystery #1:
- Conclusion: "The vampire Claudette killed Lord Denton"
- Clues:
  1. "Body drained of blood" (evidence)
  2. "Letters mentioning 'Claudette' found in fireplace" (lead)
  3. "Witness saw pale woman with red eyes leaving manor" (evidence)
```

**Track clue discovery:**
```
Mark clue #2 as found in mystery #1
```

**Check Three Clue Rule:**
```
Validate that mystery #1 follows the Three Clue Rule
```

## Troubleshooting

### Server Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Verify dependencies installed: `npm install` in server directory
- Check paths in config are absolute and correct

### Data Not Persisting
- Check `Campaign_Data/` directory was created
- Verify write permissions
- Check for JSON syntax errors in data files

### Can't See MCP in Claude
- Restart Claude Desktop after config changes
- Check config file JSON is valid
- Verify server starts without errors: `node index.js`

## Integration with Existing Tools

These MCPs integrate with:
- **Session Flow MCP** - Goals feed into session planning
- **Dungeon Ecology MCP** - Adversary rosters create living dungeons
- **Notion Sync** - Export data to Notion for campaign wiki
- **Markdown Files** - All data can be manually edited as JSON

## Framework References

Each MCP implements frameworks from:
- `../Frameworks/` - Detailed framework documentation
- `../Tables/` - Random generation tables and references

See those directories for the underlying theory and tables used by these MCPs.

## Development

To modify or extend an MCP:

1. Edit `index.js` in the server directory
2. Add new tools to `ListToolsRequestSchema` handler
3. Implement tool logic in `CallToolRequestSchema` handler
4. Test with `node index.js` (will wait for stdin)
5. Restart Claude Desktop to reload changes

## License

MIT - Use freely for your campaigns!
