#!/usr/bin/env node

/**
 * MCP Server: Conversation Classifier
 *
 * Classifies conversations as "campaign" (D&D content) or "infrastructure" (tooling/technical)
 * to determine if conversation logs should be synced to Notion.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Keywords indicating campaign-related conversations
const CAMPAIGN_KEYWORDS = [
  'session', 'player', 'character', 'pc', 'npc', 'faction', 'location',
  'encounter', 'combat', 'dungeon', 'quest', 'patron', 'lore', 'worldbuilding',
  'story', 'plot', 'narrative', 'roleplay', 'mechanics', 'stat', 'feat',
  'spell', 'item', 'artifact', 'monster', 'enemy', 'boss', 'dm guide',
  'heartstone', 'shadow', 'ratterdan', 'agastia', 'axe', 'octavia',
  'manny', 'nikki', 'rakash', 'kyle', 'josh', 'caravan'
];

// Keywords indicating infrastructure-related conversations
const INFRASTRUCTURE_KEYWORDS = [
  'sync', 'notion', 'git', 'commit', 'push', 'hook', 'mcp', 'server',
  'file watcher', 'error', 'bug', 'fix', 'script', 'python', 'node',
  'javascript', 'code', 'function', 'api', 'database', 'schema',
  'configuration', 'setup', 'install', 'dependency', 'path', 'directory',
  'permission', 'authentication', 'key', 'token', 'workflow', 'automation'
];

/**
 * Classify conversation based on context
 */
function classifyConversation(context) {
  const lowerContext = context.toLowerCase();

  let campaignScore = 0;
  let infrastructureScore = 0;

  // Count keyword matches
  for (const keyword of CAMPAIGN_KEYWORDS) {
    if (lowerContext.includes(keyword)) {
      campaignScore++;
    }
  }

  for (const keyword of INFRASTRUCTURE_KEYWORDS) {
    if (lowerContext.includes(keyword)) {
      infrastructureScore++;
    }
  }

  // Determine classification
  if (campaignScore > infrastructureScore) {
    return {
      classification: 'campaign',
      confidence: campaignScore / (campaignScore + infrastructureScore),
      reasoning: `Detected ${campaignScore} campaign keywords vs ${infrastructureScore} infrastructure keywords`,
      sync_to_notion: true
    };
  } else if (infrastructureScore > campaignScore) {
    return {
      classification: 'infrastructure',
      confidence: infrastructureScore / (campaignScore + infrastructureScore),
      reasoning: `Detected ${infrastructureScore} infrastructure keywords vs ${campaignScore} campaign keywords`,
      sync_to_notion: false
    };
  } else {
    // Tie or no keywords - default to infrastructure (safer to exclude)
    return {
      classification: 'infrastructure',
      confidence: 0.5,
      reasoning: 'Ambiguous context - defaulting to infrastructure (will not sync)',
      sync_to_notion: false
    };
  }
}

const server = new Server(
  {
    name: 'conversation-classifier',
    version: '1.0.0',
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
        name: 'classify_conversation',
        description: 'Classifies conversation context as "campaign" (D&D content) or "infrastructure" (tooling/technical) to determine if logs should sync to Notion',
        inputSchema: {
          type: 'object',
          properties: {
            context: {
              type: 'string',
              description: 'The conversation context (question + answer) to classify',
            },
          },
          required: ['context'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'classify_conversation') {
    const context = request.params.arguments.context;

    if (!context || typeof context !== 'string') {
      throw new Error('Context must be a non-empty string');
    }

    const result = classifyConversation(context);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Conversation Classifier MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
