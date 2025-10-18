/**
 * MCP TOOLS QUICK REFERENCE
 * 
 * CRITICAL RULE: When generating content, ALWAYS present 3-4 options
 * 
 * How to present options:
 * 1. Call generate_npc/generate_encounter 3-4 times with save_to_file: false
 * 2. Present ALL options to user
 * 3. User selects
 * 4. Create final version
 */

// NPC Generation - Call 3-4 times for options
async function generateNPCOptions(params) {
  const options = [];
  for (let i = 0; i < 3; i++) {
    const npc = await generate_npc({
      ...params,
      save_to_file: false,  // CRITICAL: Don't save options
      confirm_before_save: true
    });
    options.push(npc);
  }
  return options;
}

// Example usage:
// const options = await generateNPCOptions({
//   npc_type: "minor",
//   role: "patron",
//   location: "Agastia",
//   faction: "Merit Council"
// });
// Present: "Option 1: [name] - [traits]\nOption 2: [name] - [traits]\nOption 3: [name] - [traits]"

// Roll NPC initial reaction (2d6 + modifier)
// Results: 2-3=Hostile, 4-5=Unfriendly, 6-8=Neutral, 9-11=Friendly, 12+=Helpful
// await roll_reaction({ modifier: 2, context: "description" });

// All available tools:
const TOOLS = {
  // Content Generation
  generate_npc: { options_required: true, call_multiple: true },
  generate_encounter: { options_required: true, call_multiple: true },
  generate_quest: { options_required: false, presents_own_options: true },
  
  // Utility
  roll_reaction: { options_required: false },
  calculate_encounter_xp: { options_required: false },
  
  // File Operations
  create_npc: { options_required: false },
  sync_notion: { options_required: false },
  commit_and_push: { options_required: false },
  
  // Campaign State
  update_campaign_state: { options_required: false },
  get_faction_relationships: { options_required: false },
  plan_session: { options_required: false }
};

module.exports = { generateNPCOptions, TOOLS };
