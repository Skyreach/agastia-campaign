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

// Data file location
const DATA_FILE = path.join(__dirname, '..', '..', '..', 'Campaign_Data', 'goals.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Load goals from file
async function loadGoals() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return { goals: [], nextId: 1 };
  }
}

// Save goals to file
async function saveGoals(data) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Validate goal against Five Rules
function validateGoal(goal) {
  const errors = [];
  const warnings = [];

  // Rule 3: Must be achievable (measurable)
  if (!goal.success_criteria || goal.success_criteria.trim() === '') {
    errors.push("Missing success criteria - goal must be measurable");
  }

  // Rule 4: Must have consequences for failure
  if (!goal.failure_consequences || goal.failure_consequences.trim() === '') {
    errors.push("Missing failure consequences - what happens if this fails?");
  }

  // Rule 5: Must be fun to pursue (has obstacles)
  if (!goal.obstacles || goal.obstacles.length === 0) {
    errors.push("No obstacles defined - if there are no challenges, is this actually fun?");
  }

  // Rule 2: Time frame should be appropriate
  const validTimeframes = ['short', 'mid', 'long'];
  if (!validTimeframes.includes(goal.time_frame)) {
    errors.push(`Invalid time frame '${goal.time_frame}' - must be: short, mid, or long`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Create MCP server
const server = new Server(
  {
    name: "campaign-goals-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_goal",
        description: "Create a new goal for a PC, Faction, or Patron. Validates against Five Rules of Proactive Fun.",
        inputSchema: {
          type: "object",
          properties: {
            owner_type: {
              type: "string",
              enum: ["PC", "Faction", "Patron"],
              description: "Who owns this goal"
            },
            owner_name: {
              type: "string",
              description: "Name of the character/faction/patron"
            },
            content: {
              type: "string",
              description: "The goal itself (e.g., 'Free my hometown from orc rule')"
            },
            time_frame: {
              type: "string",
              enum: ["short", "mid", "long"],
              description: "Short: few sessions, Mid: 6+ sessions, Long: campaign arc"
            },
            success_criteria: {
              type: "string",
              description: "How will we know this goal is achieved? Must be specific and measurable."
            },
            failure_consequences: {
              type: "string",
              description: "What happens if this goal fails? Must advance plot differently."
            },
            obstacles: {
              type: "array",
              items: { type: "string" },
              description: "What challenges stand in the way? Must have at least one."
            },
            related_goals: {
              type: "array",
              items: { type: "number" },
              description: "IDs of other goals that overlap or conflict with this one",
              default: []
            }
          },
          required: ["owner_type", "owner_name", "content", "time_frame", "success_criteria", "failure_consequences", "obstacles"]
        }
      },
      {
        name: "list_goals",
        description: "List all goals, optionally filtered by owner type, owner name, status, or time frame",
        inputSchema: {
          type: "object",
          properties: {
            owner_type: {
              type: "string",
              enum: ["PC", "Faction", "Patron"],
              description: "Filter by owner type"
            },
            owner_name: {
              type: "string",
              description: "Filter by specific owner name"
            },
            status: {
              type: "string",
              enum: ["active", "paused", "completed", "failed", "evolved"],
              description: "Filter by goal status"
            },
            time_frame: {
              type: "string",
              enum: ["short", "mid", "long"],
              description: "Filter by time frame"
            }
          }
        }
      },
      {
        name: "update_goal",
        description: "Update an existing goal (status, progress, content, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "Goal ID to update"
            },
            status: {
              type: "string",
              enum: ["active", "paused", "completed", "failed", "evolved"],
              description: "New status"
            },
            progress_clock: {
              type: "object",
              properties: {
                segments: { type: "number", description: "Total segments (4, 6, or 8)" },
                filled: { type: "number", description: "Filled segments" }
              },
              description: "Progress clock tracking"
            },
            content: {
              type: "string",
              description: "Updated goal content"
            },
            obstacles: {
              type: "array",
              items: { type: "string" },
              description: "Updated obstacles list"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "find_goal_overlaps",
        description: "Find goals that overlap (same locations, people, objects) to create natural collision",
        inputSchema: {
          type: "object",
          properties: {
            goal_id: {
              type: "number",
              description: "Find overlaps for this specific goal (optional - if not provided, finds all overlaps)"
            }
          }
        }
      },
      {
        name: "generate_random_goal",
        description: "Generate a random goal using the tables from Proactive Roleplay (Objective + Reason + Complication)",
        inputSchema: {
          type: "object",
          properties: {
            owner_type: {
              type: "string",
              enum: ["PC", "Faction", "Patron"],
              description: "Who this goal is for"
            },
            owner_name: {
              type: "string",
              description: "Name of the character/faction/patron"
            }
          },
          required: ["owner_type", "owner_name"]
        }
      },
      {
        name: "validate_goal",
        description: "Check if a goal meets the Five Rules of Proactive Fun (without saving it)",
        inputSchema: {
          type: "object",
          properties: {
            content: { type: "string" },
            time_frame: { type: "string", enum: ["short", "mid", "long"] },
            success_criteria: { type: "string" },
            failure_consequences: { type: "string" },
            obstacles: { type: "array", items: { type: "string" } }
          },
          required: ["content", "time_frame", "success_criteria", "failure_consequences", "obstacles"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_goal": {
        const data = await loadGoals();

        const goal = {
          id: data.nextId++,
          owner_type: args.owner_type,
          owner_name: args.owner_name,
          content: args.content,
          time_frame: args.time_frame,
          success_criteria: args.success_criteria,
          failure_consequences: args.failure_consequences,
          obstacles: args.obstacles,
          related_goals: args.related_goals || [],
          status: "active",
          progress_clock: {
            segments: args.time_frame === "short" ? 4 : args.time_frame === "mid" ? 6 : 8,
            filled: 0
          },
          created_at: new Date().toISOString()
        };

        const validation = validateGoal(goal);
        if (!validation.valid) {
          return {
            content: [{
              type: "text",
              text: `❌ Goal validation failed:\n${validation.errors.join('\n')}`
            }]
          };
        }

        data.goals.push(goal);
        await saveGoals(data);

        let response = `✅ Goal created successfully!\n\n**ID:** ${goal.id}\n**Owner:** ${goal.owner_name} (${goal.owner_type})\n**Goal:** ${goal.content}\n**Time Frame:** ${goal.time_frame}\n**Progress:** ${goal.progress_clock.filled}/${goal.progress_clock.segments} segments filled`;

        if (validation.warnings.length > 0) {
          response += `\n\n⚠️ Warnings:\n${validation.warnings.join('\n')}`;
        }

        return {
          content: [{ type: "text", text: response }]
        };
      }

      case "list_goals": {
        const data = await loadGoals();
        let filtered = data.goals;

        if (args.owner_type) {
          filtered = filtered.filter(g => g.owner_type === args.owner_type);
        }
        if (args.owner_name) {
          filtered = filtered.filter(g => g.owner_name.toLowerCase().includes(args.owner_name.toLowerCase()));
        }
        if (args.status) {
          filtered = filtered.filter(g => g.status === args.status);
        }
        if (args.time_frame) {
          filtered = filtered.filter(g => g.time_frame === args.time_frame);
        }

        if (filtered.length === 0) {
          return {
            content: [{ type: "text", text: "No goals found matching the criteria." }]
          };
        }

        const output = filtered.map(g => {
          const progress = `[${String(g.progress_clock.filled).padStart(2, '0')}/${g.progress_clock.segments}]`;
          const statusIcon = {
            active: '🎯',
            paused: '⏸️',
            completed: '✅',
            failed: '❌',
            evolved: '🔄'
          }[g.status] || '';

          return `${statusIcon} **#${g.id}** ${progress} ${g.owner_name} (${g.owner_type})\n   ${g.content}\n   Status: ${g.status} | Time: ${g.time_frame}`;
        }).join('\n\n');

        return {
          content: [{ type: "text", text: `**Campaign Goals** (${filtered.length} total)\n\n${output}` }]
        };
      }

      case "update_goal": {
        const data = await loadGoals();
        const goal = data.goals.find(g => g.id === args.id);

        if (!goal) {
          return {
            content: [{ type: "text", text: `❌ Goal #${args.id} not found.` }]
          };
        }

        if (args.status) goal.status = args.status;
        if (args.progress_clock) goal.progress_clock = args.progress_clock;
        if (args.content) goal.content = args.content;
        if (args.obstacles) goal.obstacles = args.obstacles;

        goal.updated_at = new Date().toISOString();

        await saveGoals(data);

        return {
          content: [{ type: "text", text: `✅ Goal #${args.id} updated successfully!\n\n${goal.owner_name}: ${goal.content}\nStatus: ${goal.status} | Progress: ${goal.progress_clock.filled}/${goal.progress_clock.segments}` }]
        };
      }

      case "find_goal_overlaps": {
        const data = await loadGoals();

        // Simple keyword-based overlap detection
        // Look for common nouns (locations, people, objects) between goals
        const overlaps = [];

        const goals = args.goal_id
          ? [data.goals.find(g => g.id === args.goal_id)]
          : data.goals;

        for (const goal of goals) {
          if (!goal) continue;

          const goalWords = new Set(
            goal.content.toLowerCase().split(/\s+/)
              .filter(w => w.length > 4) // Ignore short words
          );

          for (const other of data.goals) {
            if (other.id === goal.id) continue;

            const otherWords = new Set(
              other.content.toLowerCase().split(/\s+/)
                .filter(w => w.length > 4)
            );

            const common = [...goalWords].filter(w => otherWords.has(w));

            if (common.length > 0) {
              overlaps.push({
                goal1: `#${goal.id}: ${goal.content} (${goal.owner_name})`,
                goal2: `#${other.id}: ${other.content} (${other.owner_name})`,
                keywords: common.join(', ')
              });
            }
          }
        }

        if (overlaps.length === 0) {
          return {
            content: [{ type: "text", text: "No obvious goal overlaps detected. Consider manually adding related_goals connections." }]
          };
        }

        const output = overlaps.map(o =>
          `🔗 **Overlap detected:**\n   ${o.goal1}\n   ${o.goal2}\n   Common keywords: ${o.keywords}`
        ).join('\n\n');

        return {
          content: [{ type: "text", text: `**Goal Overlaps Found** (${overlaps.length})\n\n${output}` }]
        };
      }

      case "generate_random_goal": {
        // Simple random generation from tables
        const objectives = [
          "Win the heart of a certain person",
          "Discover the true identity of an important person",
          "Return to my homeland",
          "Slay a powerful monster",
          "Defend a settlement from attack",
          "Obtain a powerful artifact",
          "Destroy a dangerous artifact",
          "Find a missing family member",
          "Claim my ancestral birthright",
          "Kill a god or powerful entity"
        ];

        const reasons = [
          "deep-seated desire to be loved",
          "need to be appreciated and admired",
          "genuine concern for others' wellbeing",
          "promise to a dying family member",
          "spite and desire to prove others wrong",
          "hunger for power and control",
          "quest of self-improvement",
          "spiritual enlightenment or divine calling"
        ];

        const complications = [
          "there's a big misunderstanding about the situation",
          "a rival is interested in the same thing",
          "this would anger a local politician or authority",
          "it's really, really far away",
          "I'm missing key information",
          "the location is very dangerous for me specifically",
          "I'm bound by a sworn vow that makes this harder",
          "the trail has gone cold"
        ];

        const obj = objectives[Math.floor(Math.random() * objectives.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        const comp = complications[Math.floor(Math.random() * complications.length)];

        const generated = `${obj} because of ${reason}, but ${comp}`;

        return {
          content: [{
            type: "text",
            text: `🎲 **Random Goal Generated**\n\n"My character wants to ${generated}"\n\n**Owner:** ${args.owner_name} (${args.owner_type})\n\n*Now add success criteria, failure consequences, and obstacles to create this goal!*`
          }]
        };
      }

      case "validate_goal": {
        const tempGoal = {
          content: args.content,
          time_frame: args.time_frame,
          success_criteria: args.success_criteria,
          failure_consequences: args.failure_consequences,
          obstacles: args.obstacles
        };

        const validation = validateGoal(tempGoal);

        if (validation.valid) {
          return {
            content: [{ type: "text", text: `✅ Goal validation passed!\n\nThis goal meets the Five Rules of Proactive Fun.` }]
          };
        } else {
          return {
            content: [{ type: "text", text: `❌ Goal validation failed:\n\n${validation.errors.join('\n')}` }]
          };
        }
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Campaign Goals MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
