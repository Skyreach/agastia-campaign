#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACTIONS_FILE = path.join(__dirname, '..', '..', '..', 'Campaign_Data', 'factions.json');
const PATRONS_FILE = path.join(__dirname, '..', '..', '..', 'Campaign_Data', 'patrons.json');

async function ensureDataDir() {
  const dir = path.dirname(FACTIONS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function loadFactions() {
  try {
    const data = await fs.readFile(FACTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { factions: [], nextId: 1 };
  }
}

async function saveFactions(data) {
  await ensureDataDir();
  await fs.writeFile(FACTIONS_FILE, JSON.stringify(data, null, 2));
}

async function loadPatrons() {
  try {
    const data = await fs.readFile(PATRONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { patrons: [], nextId: 1 };
  }
}

async function savePatrons(data) {
  await ensureDataDir();
  await fs.writeFile(PATRONS_FILE, JSON.stringify(data, null, 2));
}

// Faction Conflict Table (1d8)
const FACTION_CONFLICTS = [
  {
    result: "Stalemate Skirmish",
    effect: "Both factions largely unaffected. Subtract 1-2 members or reinforce defenses. Signs of conflict visible."
  },
  {
    result: "Faction 1 Damaged",
    effect: "Faction 1 loses ~25% strength. Eliminate some encounters or subtract 1d4 members from each group."
  },
  {
    result: "Faction 1 Crippled",
    effect: "Faction 1 loses ~50% strength. Entire action groups lost. May lose territory."
  },
  {
    result: "Faction 1 Destroyed",
    effect: "Faction 1 eliminated entirely. Lair empty, occupied, or restocked. Power vacuum created."
  },
  {
    result: "Both Factions Damaged",
    effect: "Both factions lose ~25% strength. Opportunity for PCs to tip balance."
  },
  {
    result: "Both Factions Crippled",
    effect: "Both factions lose ~50% strength. Area may be wasteland. PCs could dominate both."
  },
  {
    result: "Both Factions Destroyed",
    effect: "Both eliminated. Area empty. Massive power vacuum."
  },
  {
    result: "Factions Unite",
    effect: "Factions allied (temporarily or permanently). Much stronger combined. May threaten PCs."
  }
];

const server = new Server(
  {
    name: "factions-patrons-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_faction",
        description: "Create a new faction with the Four Elements (Identity, Area, Power, Ideology)",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Faction name" },
            archetype: {
              type: "string",
              enum: ["Government", "Labor", "Criminal", "Religious", "Custom"],
              description: "Faction archetype"
            },
            power_level: {
              type: "string",
              enum: ["Weak", "Moderate", "Strong", "Dominant"],
              description: "Relative power level"
            },
            territory: {
              type: "array",
              items: { type: "string" },
              description: "Areas faction controls (e.g., ['Temple District', 'Underground Catacombs'])"
            },
            ideology: {
              type: "string",
              description: "Core principles - why do they do what they do?"
            },
            goals: {
              type: "object",
              properties: {
                long_term: { type: "string" },
                mid_term: { type: "string" },
                short_term: { type: "string" }
              },
              description: "Faction goals (optional - can be added later)"
            },
            reaction_to_pcs: {
              type: "string",
              enum: ["Immediate Attack", "Hostile", "Cautious", "Neutral", "Amiable"],
              description: "Default reaction to PCs (optional - can roll later)"
            }
          },
          required: ["name", "archetype", "power_level", "territory", "ideology"]
        }
      },
      {
        name: "list_factions",
        description: "List all factions, optionally filtered by archetype or power level",
        inputSchema: {
          type: "object",
          properties: {
            archetype: {
              type: "string",
              enum: ["Government", "Labor", "Criminal", "Religious", "Custom"]
            },
            power_level: {
              type: "string",
              enum: ["Weak", "Moderate", "Strong", "Dominant"]
            }
          }
        }
      },
      {
        name: "update_faction",
        description: "Update faction details (power, territory, goals, roster, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Faction ID" },
            power_level: { type: "string", enum: ["Weak", "Moderate", "Strong", "Dominant"] },
            territory: { type: "array", items: { type: "string" } },
            goals: {
              type: "object",
              properties: {
                long_term: { type: "string" },
                mid_term: { type: "string" },
                short_term: { type: "string" }
              }
            },
            reaction_to_pcs: {
              type: "string",
              enum: ["Immediate Attack", "Hostile", "Cautious", "Neutral", "Amiable"]
            },
            notes: { type: "string" }
          },
          required: ["id"]
        }
      },
      {
        name: "run_faction_conflict",
        description: "Roll for faction conflict (1d6, conflict on 1) and resolve outcome if conflict occurs",
        inputSchema: {
          type: "object",
          properties: {
            force_conflict: {
              type: "boolean",
              description: "Skip the 1d6 check and force a conflict to occur",
              default: false
            },
            faction1_id: {
              type: "number",
              description: "Specific faction ID for first combatant (optional - will roll randomly if not provided)"
            },
            faction2_id: {
              type: "number",
              description: "Specific faction ID for second combatant (optional - will roll randomly if not provided)"
            }
          }
        }
      },
      {
        name: "create_patron",
        description: "Create a patron linked to a faction",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Patron name" },
            faction_id: { type: "number", description: "Faction they represent" },
            resources: {
              type: "array",
              items: { type: "string" },
              description: "Resources available (wealth, information, manpower, etc.)"
            },
            personality_traits: {
              type: "array",
              items: { type: "string" },
              description: "2-3 adjectives describing personality"
            },
            long_term_goals: {
              type: "array",
              items: { type: "string" },
              description: "What patron ultimately wants"
            }
          },
          required: ["name", "faction_id", "resources", "personality_traits"]
        }
      },
      {
        name: "list_patrons",
        description: "List all patrons, optionally filtered by faction",
        inputSchema: {
          type: "object",
          properties: {
            faction_id: { type: "number", description: "Filter by faction" }
          }
        }
      },
      {
        name: "generate_patron_negotiation",
        description: "Generate a patron negotiation based on PC's short-term goal",
        inputSchema: {
          type: "object",
          properties: {
            patron_id: { type: "number", description: "Patron conducting negotiation" },
            pc_goal: { type: "string", description: "What the PC wants to accomplish" },
            pc_goal_category: {
              type: "string",
              enum: [
                "obtain_magic_item", "obtain_knowledge", "gain_access", "delve_location",
                "gain_invitation", "eliminate_enemy", "prove_devotion", "protect_someone",
                "escort", "gather_info", "locate_item", "learn_spell", "gain_favor",
                "undermine_faction", "aid_victims", "hunt_monster", "clear_dungeon"
              ],
              description: "Category of PC goal for table lookup"
            }
          },
          required: ["patron_id", "pc_goal", "pc_goal_category"]
        }
      },
      {
        name: "update_patron_relationship",
        description: "Update patron's relationship status and negotiation dials with PCs",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Patron ID" },
            relationship_status: {
              type: "string",
              enum: ["Initial Contact", "Ongoing", "Trusted", "Inner Circle", "Betrayed"]
            },
            jobs_completed: { type: "number", description: "Number of jobs completed for patron" },
            aid_level: {
              type: "string",
              enum: ["None", "Minimal", "Substantial", "Full"],
              description: "Current aid dial setting"
            },
            restriction_level: {
              type: "string",
              enum: ["None", "Minor", "Significant", "Full"],
              description: "Current restriction dial setting"
            },
            notes: { type: "string", description: "Notes on relationship" }
          },
          required: ["id"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_faction": {
        const data = await loadFactions();

        const faction = {
          id: data.nextId++,
          name: args.name,
          archetype: args.archetype,
          power_level: args.power_level,
          territory: args.territory,
          ideology: args.ideology,
          goals: args.goals || { long_term: "", mid_term: "", short_term: "" },
          reaction_to_pcs: args.reaction_to_pcs || "Cautious",
          roster: [],
          progress_clocks: [],
          created_at: new Date().toISOString()
        };

        data.factions.push(faction);
        await saveFactions(data);

        return {
          content: [{
            type: "text",
            text: `✅ **Faction Created: ${faction.name}**\n\n**ID:** ${faction.id}\n**Archetype:** ${faction.archetype}\n**Power:** ${faction.power_level}\n**Territory:** ${faction.territory.join(', ')}\n**Ideology:** ${faction.ideology}\n**Reaction to PCs:** ${faction.reaction_to_pcs}`
          }]
        };
      }

      case "list_factions": {
        const data = await loadFactions();
        let filtered = data.factions;

        if (args.archetype) {
          filtered = filtered.filter(f => f.archetype === args.archetype);
        }
        if (args.power_level) {
          filtered = filtered.filter(f => f.power_level === args.power_level);
        }

        if (filtered.length === 0) {
          return {
            content: [{ type: "text", text: "No factions found matching criteria." }]
          };
        }

        const output = filtered.map(f => {
          const powerIcon = { Weak: '⚪', Moderate: '🔵', Strong: '🟢', Dominant: '🔴' }[f.power_level] || '';
          return `${powerIcon} **#${f.id} ${f.name}** (${f.archetype})\n   Power: ${f.power_level} | Territory: ${f.territory.join(', ')}\n   Ideology: ${f.ideology}\n   PC Reaction: ${f.reaction_to_pcs}`;
        }).join('\n\n');

        return {
          content: [{ type: "text", text: `**Campaign Factions** (${filtered.length} total)\n\n${output}` }]
        };
      }

      case "update_faction": {
        const data = await loadFactions();
        const faction = data.factions.find(f => f.id === args.id);

        if (!faction) {
          return {
            content: [{ type: "text", text: `❌ Faction #${args.id} not found.` }]
          };
        }

        if (args.power_level) faction.power_level = args.power_level;
        if (args.territory) faction.territory = args.territory;
        if (args.goals) faction.goals = { ...faction.goals, ...args.goals };
        if (args.reaction_to_pcs) faction.reaction_to_pcs = args.reaction_to_pcs;
        if (args.notes) faction.notes = args.notes;

        faction.updated_at = new Date().toISOString();

        await saveFactions(data);

        return {
          content: [{ type: "text", text: `✅ **Faction #${args.id} Updated: ${faction.name}**` }]
        };
      }

      case "run_faction_conflict": {
        const data = await loadFactions();

        if (data.factions.length < 2) {
          return {
            content: [{ type: "text", text: "❌ Need at least 2 factions for conflict." }]
          };
        }

        // Check if conflict occurs
        if (!args.force_conflict) {
          const roll = Math.floor(Math.random() * 6) + 1;
          if (roll !== 1) {
            return {
              content: [{ type: "text", text: `🎲 Conflict check: ${roll}/6\n\nNo faction conflict occurred this session. Peace... for now.` }]
            };
          }
        }

        // Select factions
        let faction1, faction2;

        if (args.faction1_id && args.faction2_id) {
          faction1 = data.factions.find(f => f.id === args.faction1_id);
          faction2 = data.factions.find(f => f.id === args.faction2_id);
        } else {
          const indices = [];
          while (indices.length < 2) {
            const idx = Math.floor(Math.random() * data.factions.length);
            if (!indices.includes(idx)) indices.push(idx);
          }
          faction1 = data.factions[indices[0]];
          faction2 = data.factions[indices[1]];
        }

        // Roll outcome
        const outcomeRoll = Math.floor(Math.random() * 8);
        const outcome = FACTION_CONFLICTS[outcomeRoll];

        let response = `🎲 **FACTION CONFLICT!**\n\n**Combatants:**\n- ${faction1.name} (${faction1.archetype}, ${faction1.power_level})\n- ${faction2.name} (${faction2.archetype}, ${faction2.power_level})\n\n**Outcome:** ${outcome.result}\n**Effect:** ${outcome.effect}\n\n---\n\n**What happened?**\n`;

        // Apply narrative based on outcome
        switch (outcome.result) {
          case "Stalemate Skirmish":
            response += `A brief skirmish between ${faction1.name} and ${faction2.name} ended inconclusively. Both sides took minor casualties but neither gained ground. Expect increased tension and fortified defenses.`;
            break;
          case "Faction 1 Damaged":
            response += `${faction1.name} suffered significant losses in conflict with ${faction2.name}. They've lost approximately 25% of their strength. ${faction2.name} is emboldened and may press their advantage.`;
            break;
          case "Faction 1 Crippled":
            response += `${faction2.name} dealt a devastating blow to ${faction1.name}, crippling their operations. ${faction1.name} has lost approximately 50% of their forces and may have lost territory. They're vulnerable to further attacks.`;
            break;
          case "Faction 1 Destroyed":
            response += `${faction2.name} has completely destroyed ${faction1.name}! Their territory is now empty or occupied. A massive power vacuum has been created. Other factions (or the PCs) may rush to fill it.`;
            break;
          case "Both Factions Damaged":
            response += `Brutal conflict between ${faction1.name} and ${faction2.name} left both sides bloodied. Each faction lost ~25% of their strength. Neither can press advantage. Perfect opportunity for PCs or third faction to tip the balance.`;
            break;
          case "Both Factions Crippled":
            response += `Catastrophic battle between ${faction1.name} and ${faction2.name}! Both factions devastated, each losing ~50% of their forces. The contested area may be a wasteland. PCs could easily dominate both weakened factions now.`;
            break;
          case "Both Factions Destroyed":
            response += `Total mutual destruction! ${faction1.name} and ${faction2.name} have annihilated each other. The area is now empty. MASSIVE power vacuum created. Perfect opportunity for new faction to rise or PCs to take control.`;
            break;
          case "Factions Unite":
            response += `Surprise! ${faction1.name} and ${faction2.name} have united! Whether through alliance, conquest, or merger, they're now a single, much more powerful force. This combined faction may now threaten the PCs.`;
            break;
        }

        response += `\n\n**GM Actions Required:**\n- Update adversary rosters for affected factions\n- Modify dungeon keys if territory changed\n- Create new hooks from this conflict\n- Determine how PCs learn about this\n- Consider consequences for PC allies/enemies`;

        return {
          content: [{ type: "text", text: response }]
        };
      }

      case "create_patron": {
        const patronData = await loadPatrons();
        const factionData = await loadFactions();

        const faction = factionData.factions.find(f => f.id === args.faction_id);
        if (!faction) {
          return {
            content: [{ type: "text", text: `❌ Faction #${args.faction_id} not found.` }]
          };
        }

        const patron = {
          id: patronData.nextId++,
          name: args.name,
          faction_id: args.faction_id,
          faction_name: faction.name,
          resources: args.resources,
          personality_traits: args.personality_traits,
          long_term_goals: args.long_term_goals || [],
          relationship_status: "Initial Contact",
          jobs_completed: 0,
          aid_level: "Minimal",
          restriction_level: "Moderate",
          created_at: new Date().toISOString()
        };

        patronData.patrons.push(patron);
        await savePatrons(patronData);

        return {
          content: [{
            type: "text",
            text: `✅ **Patron Created: ${patron.name}**\n\n**ID:** ${patron.id}\n**Faction:** ${patron.faction_name}\n**Resources:** ${patron.resources.join(', ')}\n**Personality:** ${patron.personality_traits.join(', ')}\n**Relationship:** ${patron.relationship_status}\n**Dials:** Aid=${patron.aid_level}, Restrictions=${patron.restriction_level}`
          }]
        };
      }

      case "list_patrons": {
        const data = await loadPatrons();
        let filtered = data.patrons;

        if (args.faction_id) {
          filtered = filtered.filter(p => p.faction_id === args.faction_id);
        }

        if (filtered.length === 0) {
          return {
            content: [{ type: "text", text: "No patrons found." }]
          };
        }

        const output = filtered.map(p => {
          const relationIcon = {
            "Initial Contact": "🤝",
            "Ongoing": "👥",
            "Trusted": "💼",
            "Inner Circle": "⭐",
            "Betrayed": "💔"
          }[p.relationship_status] || "";

          return `${relationIcon} **#${p.id} ${p.name}** (${p.faction_name})\n   Resources: ${p.resources.join(', ')}\n   Personality: ${p.personality_traits.join(', ')}\n   Relationship: ${p.relationship_status} (${p.jobs_completed} jobs)\n   Dials: Aid=${p.aid_level}, Restrictions=${p.restriction_level}`;
        }).join('\n\n');

        return {
          content: [{ type: "text", text: `**Campaign Patrons** (${filtered.length} total)\n\n${output}` }]
        };
      }

      case "generate_patron_negotiation": {
        const data = await loadPatrons();
        const patron = data.patrons.find(p => p.id === args.patron_id);

        if (!patron) {
          return {
            content: [{ type: "text", text: `❌ Patron #${args.patron_id} not found.` }]
          };
        }

        // Simplified negotiation table lookup
        const negotiations = {
          obtain_magic_item: {
            patron_goal: "Expand network of resources",
            terms: ["Ownership with rental rights to PC", "Patron gets first use/study", "Patron gets similar item if found"]
          },
          delve_location: {
            patron_goal: "Enforce claim on land/property",
            terms: ["Retrieve specific item from location", "Help establish base there", "Give patron ownership/economic stake"]
          },
          eliminate_enemy: {
            patron_goal: "Get revenge on someone",
            terms: ["Conceal patron involvement", "Split bounty with patron", "Make death look accidental"]
          },
          hunt_monster: {
            patron_goal: "Varies by patron archetype",
            terms: ["Bring monster alive for study", "Specific body parts preserved", "Proof of kill for patron's reputation"]
          }
        };

        const negotiation = negotiations[args.pc_goal_category] || {
          patron_goal: "Advance faction interests",
          terms: ["Patron receives portion of rewards", "PC must report findings", "Patron gets public credit"]
        };

        let response = `🤝 **PATRON NEGOTIATION**\n\n**Patron:** ${patron.name}\n**PC Goal:** ${args.pc_goal}\n\n**Patron's Related Goal:** ${negotiation.patron_goal}\n\n**Proposed Terms:**\n`;

        negotiation.terms.forEach((term, i) => {
          response += `${i + 1}. ${term}\n`;
        });

        response += `\n**Current Dials:**\n- Aid Level: ${patron.aid_level}\n- Restriction Level: ${patron.restriction_level}\n\n**Available Resources:** ${patron.resources.join(', ')}\n\n**Personality Considerations:** ${patron.personality_traits.join(', ')} - how would they negotiate based on this?`;

        return {
          content: [{ type: "text", text: response }]
        };
      }

      case "update_patron_relationship": {
        const data = await loadPatrons();
        const patron = data.patrons.find(p => p.id === args.id);

        if (!patron) {
          return {
            content: [{ type: "text", text: `❌ Patron #${args.id} not found.` }]
          };
        }

        if (args.relationship_status) patron.relationship_status = args.relationship_status;
        if (args.jobs_completed !== undefined) patron.jobs_completed = args.jobs_completed;
        if (args.aid_level) patron.aid_level = args.aid_level;
        if (args.restriction_level) patron.restriction_level = args.restriction_level;
        if (args.notes) patron.notes = args.notes;

        patron.updated_at = new Date().toISOString();

        await savePatrons(data);

        return {
          content: [{ type: "text", text: `✅ **Patron #${args.id} Relationship Updated: ${patron.name}**\n\nRelationship: ${patron.relationship_status} (${patron.jobs_completed} jobs)\nDials: Aid=${patron.aid_level}, Restrictions=${patron.restriction_level}` }]
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Factions & Patrons MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
