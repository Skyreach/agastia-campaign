# Quest Generation MCP Tool

## Overview
The `generate_quest` MCP tool creates quests using **Dungeon World Fronts/Grim Portents** mechanics with node-based progression. Quests are story mechanisms to achieve goals, not goals themselves.

## Key Concepts

### Quests vs. Goals
- **Goals**: Long-term objectives tracked in PC/faction files (e.g., "Find the Codex", "Kill the storm giant")
- **Quests**: Story structures with multiple nodes that help achieve goals (e.g., "Journey to Ratterdan to find clues about the giant")

### Fronts & Grim Portents (Dungeon World)
- **Front**: An impending danger or situation (the "Impending Doom")
- **Grim Portents**: Steps that happen if heroes don't intervene
- **Nodes**: Quest progression points with travel time, encounters, and outcomes

## Tool Parameters

### Required Parameters (or prompt for suggestions)
- `quest_type`: 'mission', 'travel', or 'mixed'
- `location`: Primary location for the quest
- `patron_npc`: NPC issuing the quest
- `num_nodes`: Number of quest steps/nodes (2-10)
- `completion_time_days`: Total in-game time needed
- `base_monster`: Boss/threat for the "Impending Doom"

### Optional Parameters
- `reward_npc`: Different NPC providing reward (defaults to patron)
- `hook_number`: Reference number for adventure hooks
- `export_mermaid`: Boolean - export as Mermaid diagram (default: false)

## Quest Node Structure

Each node includes:
- **Name**: Descriptive node title
- **Travel Time**: How long to reach this node (hours/days)
- **Completion Time**: How long the node takes to complete
- **Encounter**: Type (combat/skill_challenge/social/exploration) and description
- **Success**: What happens on success (usually progress to next node)
- **Failure**: "Fail forward" consequence (quest continues but with complications)
- **Abandon**: Consequences if players abandon the quest
- **Reward**: Minor rewards (information, items) or major rewards (final node)

## Example Usage

### Full Quest Generation
```json
{
  "quest_type": "mixed",
  "location": "Ratterdan",
  "patron_npc": "The Patron",
  "num_nodes": 5,
  "completion_time_days": 7,
  "base_monster": "Storm Giant",
  "export_mermaid": true
}
```

**Output**: Complete quest with 5 nodes, including Mermaid diagram

### Partial Quest (Get Suggestions)
```json
{
  "quest_type": "travel"
}
```

**Output**: Suggestions for:
- 3 location options from campaign
- 3 NPC patron options
- 3 monster/boss options
- Time estimate options (quick/standard/extended)
- Node count options (3, 5, 7)

## Quest Output Format

```markdown
# Quest: [Location] Mission

**Type:** [mission/travel/mixed]
**Patron:** [NPC Name]
**Reward Giver:** [NPC Name]
**Total Time:** X days
**Hook:** [Hook number or "Generated"]

## Impending Doom
If the heroes do nothing, [Boss] will threaten [Location]
**Boss:** [Monster/Villain]

## Quest Nodes (X)

### Node 1: Discover the Threat
- **Travel Time:** 12 hours
- **Completion Time:** 6 hours
- **Encounter:** combat - Combat encounter with minions of [Boss]
- **Success:** Progress to Node 2. Gain advantage on next node. Learn critical information.
- **Failure:** Fail forward: Impending doom advances. Time pressure increases.
- **Abandon:** Abandon consequences: [Location] suffers consequences...
- **Reward:** Minor reward: Useful item, information, or temporary ally

[Additional nodes...]

### Node 5: Final Showdown with [Boss]
- **Travel Time:** 1 day
- **Completion Time:** Final confrontation
- **Encounter:** exploration - Exploration and discovery of clues about [Boss]
- **Success:** Progress to Node 6. Quest complete! Impending doom prevented.
- **Failure:** Fail forward: [Boss] grows stronger, final battle harder.
- **Abandon:** Abandon consequences: [Location] suffers consequences...
- **Reward:** Major reward: Magic item, faction alliance, or significant gold
```

## Mermaid Diagram Export

When `export_mermaid: true`, the tool generates a flowchart showing:
- Quest start with patron
- Each node with encounter type
- Success paths (linear progression)
- Failure paths (fail forward to next node)
- Abandon paths (to quest failure state)
- Final outcomes (quest complete or abandoned)

### Example Mermaid Output
```mermaid
graph TD
  Start([Quest Start: The Patron]) --> Node1
  Node1["Node 1: Discover the Threat<br/>combat"] --> |Success| Node2
  Node1 --> |Failure| Fail1["Impending doom advances..."]
  Node1 --> |Abandon| Abandon1["Ratterdan suffers consequences..."]
  Fail1 --> Node2
  Abandon1 --> QuestEnd[Quest Abandoned]

  [Additional nodes...]

  End([Quest Complete: Storm Giant Defeated])
  QuestEnd([Consequences in Ratterdan])
```

Test your diagram at: https://mermaid.live/

## Integration with Campaign

### Campaign Context Used
- **Locations**: Suggests appropriate quest locations (City/Town/Wilderness/Dungeon)
- **NPCs**: Suggests NPCs with 'Patron' in name or 'quest_giver' role
- **Goals**: Quests help achieve PC/faction goals
- **Artifacts**: Quests can revolve around finding/protecting artifacts

### Best Practices
1. **Link quests to goals**: Each quest should help progress at least one PC or faction goal
2. **Use time pressure**: Total time should create urgency without being impossible
3. **Fail forward**: Failures complicate but don't stop the quest
4. **Meaningful rewards**: Final node reward should justify the quest effort
5. **Impending doom**: Make consequences of inaction clear and significant

## Testing

Run test documentation:
```bash
node /mnt/c/dnd/mcp_server/test_quest_generation.js
```

This displays test cases and verification steps.

## Files
- Implementation: `/mnt/c/dnd/mcp_server/server.js` (lines 867-2223)
- Test suite: `/mnt/c/dnd/mcp_server/test_quest_generation.js`
- Documentation: This file

## Version
- Added: 2025-10-03
- Version: 1.0.0
- Status: Implemented and tested
