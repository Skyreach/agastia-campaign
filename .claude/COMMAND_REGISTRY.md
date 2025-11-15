# Command Registry

Central registry of all slash commands available for the Agastia Campaign.

## Available Commands

### Content Generation

#### `/npc` - Generate NPC
Create a new NPC using workflow-enforced process with options-first approach.

**Parameters (all optional):**
- `npc_type`: major | minor | faction | location | random
- `role`: ally | rival | neutral | villain | patron | merchant | quest_giver
- `faction`: Associated faction name
- `location`: Current location
- `cr`: Challenge rating (if combatant)
- `include_stat_block`: true | false

**Example:** `/npc npc_type=major role=patron`

---

#### `/encounter` - Generate Encounter
Create a new encounter using workflow-enforced process with resource drain mechanics.

**Parameters (all optional):**
- `encounter_type`: combat | environmental | social | trap | mixed
- `difficulty`: Easy | Medium | Hard | Deadly
- `location`: Where the encounter takes place
- `resource_focus`: spell_slots | hit_dice | abilities | mixed

**Example:** `/encounter encounter_type=combat difficulty=Hard`

---

#### `/quest` - Generate Quest
Create a new quest using Fronts/Grim Portents mechanics with node-based progression.

**Parameters (all optional):**
- `quest_type`: mission | travel | mixed
- `location`: Primary location
- `patron_npc`: NPC issuing the quest
- `reward_npc`: NPC providing reward
- `num_nodes`: Quest steps (2-10)
- `completion_time_days`: In-game time
- `base_monster`: Boss/threat
- `hook_number`: Adventure hook reference
- `export_mermaid`: true | false

**Example:** `/quest quest_type=mission location="Ratterdan Ruins"`

---

#### `/session` - Plan Session
Create a new session plan following SESSION_FORMAT_SPEC.md with workflow enforcement.

**Parameters (all optional):**
- `session_number`: Session number
- `title`: Session title/theme
- `focus`: combat | social | exploration | mixed
- `session_type`: linear | node-based | sandbox | dungeon-crawl

**Example:** `/session session_number=2 title="Shadow Market" focus=social`

---

#### `/dungeon` - Create Dungeon
Create a dungeon with ecology and session flow using Jaquaysing principles.

**Parameters (all optional):**
- `dungeon_name`: Name of the dungeon
- `dungeon_type`: cave | ruins | building | forest | underground
- `size`: small | medium | large
- `primary_faction`: Dominant creature/faction
- `session_number`: Associated session number

**Example:** `/dungeon dungeon_name="Ratterdan Crypts" dungeon_type=ruins size=small`

---

### Workflow Management

#### `/sync` - Complete Sync Pipeline
Run full synchronization: file organization, format validation, Notion sync, git push.

**Parameters:** None

**Process:**
1. File organization (file-organizer MCP)
2. Format validation (format-validator MCP)
3. Notion sync (dnd-campaign MCP)
4. Git commit and push

**Example:** `/sync`

---

#### `/plan` - Track Conversation
Track and classify current conversation for campaign planning.

**Parameters:** None

**Process:**
1. Classify conversation type (conversation-classifier MCP)
2. Track decisions and entities (conversation-tracker MCP)
3. Generate planning summary with action items
4. Save to planning log

**Example:** `/plan`

---

## Command Usage Notes

### Workflow Enforcement
All content generation commands (`/npc`, `/encounter`, `/quest`, `/session`, `/dungeon`) use workflow enforcement:

1. **Start workflow** - Creates workflow_id for tracking
2. **Present options** - Shows 3-4 options for user selection
3. **User selects** - User chooses preferred option
4. **Generate content** - Creates content with selected parameters
5. **Get approval** - Shows preview for user approval
6. **Save and sync** - Saves to file and syncs to Notion
7. **Complete workflow** - Marks workflow as complete

### Optional Parameters
All parameters are optional. If not provided:
- Commands will present options for selection
- Sensible defaults are used where applicable
- Campaign context is used to suggest values

### MCP Integration
Commands integrate with multiple MCP servers:
- **dnd-campaign** - Main campaign operations
- **dungeon-ecology** - Living dungeon ecosystems
- **session-flow** - Session flowchart management
- **file-organizer** - File organization
- **format-validator** - Format validation
- **workflow-enforcer** - Workflow stage tracking
- **conversation-classifier** - Conversation classification
- **conversation-tracker** - Conversation tracking

---

## Adding New Commands

To add a new command:

1. Create `/mnt/e/dnd/agastia-campaign/.claude/commands/[command-name].md` (documentation)
2. Create `/mnt/e/dnd/agastia-campaign/.claude/commands/[command-name].prompt.md` (executable prompt)
3. Update this registry with command details
4. Restart Claude Desktop to load new command

**Documentation template (.md):**
```markdown
# [Command Name] Command

[Brief description]

## Process:
[Step-by-step process]

## Parameters (all optional):
- **param1**: description
- **param2**: description

## Example Usage:
```
/command param1=value
```
```

**Prompt template (.prompt.md):**
```markdown
[Detailed instructions for Claude to execute this command]

Parameters available (all optional):
- param1: description
- param2: description

Process:
1. Step 1
2. Step 2
...
```

---

## Version History

- **2025-01-15** - Initial command registry created
  - Added: /npc, /encounter, /quest, /session, /dungeon, /sync, /plan
