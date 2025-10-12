#!/usr/bin/env node

/**
 * MCP Server: Conversation Tracker
 *
 * Logs conversations to markdown files with references to source documents.
 * Keeps Q&A pairs organized and synced to Notion.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

const CAMPAIGN_ROOT = process.env.CAMPAIGN_ROOT || process.cwd();
const CONVERSATION_LOGS_DIR = path.join(CAMPAIGN_ROOT, '.working/conversation_logs');
const DEVELOPMENT_DIR = path.join(CAMPAIGN_ROOT, '.working/development');

/**
 * Ensure directories exist
 */
async function ensureDirectories() {
  await fs.mkdir(CONVERSATION_LOGS_DIR, { recursive: true });
  await fs.mkdir(DEVELOPMENT_DIR, { recursive: true });
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Log a conversation to markdown file
 */
async function logConversation(question, answer, conversationType, topic, references = []) {
  await ensureDirectories();

  const targetDir = conversationType === 'campaign' ? CONVERSATION_LOGS_DIR : DEVELOPMENT_DIR;
  const fileName = `${topic.replace(/\s+/g, '_')}.md`;
  const filePath = path.join(targetDir, fileName);

  // Check if file exists
  let content = '';
  let fileExists = false;

  try {
    content = await fs.readFile(filePath, 'utf-8');
    fileExists = true;
  } catch (error) {
    // File doesn't exist - create frontmatter
    const tags = conversationType === 'campaign'
      ? ['campaign', 'conversation-log']
      : ['infrastructure', 'development'];

    content = `---
name: ${topic}
type: Conversation Log
date: ${getCurrentDate()}
tags: [${tags.join(', ')}]
---

# ${topic}

`;
  }

  // Append Q&A entry
  const timestamp = new Date().toISOString();
  const entry = `
## Q: ${question}

${references.length > 0 ? `**References:** ${references.join(', ')}\n` : ''}
**Timestamp:** ${timestamp}

${answer}

---
`;

  content += entry;

  await fs.writeFile(filePath, content, 'utf-8');

  return {
    file_path: filePath,
    conversation_type: conversationType,
    synced_to_notion: conversationType === 'campaign',
    message: `Logged conversation to ${fileName}`
  };
}

/**
 * List recent conversation logs
 */
async function listRecentLogs(limit = 10) {
  await ensureDirectories();

  const logs = [];

  // Read campaign logs
  try {
    const campaignFiles = await fs.readdir(CONVERSATION_LOGS_DIR);
    for (const file of campaignFiles) {
      if (file.endsWith('.md')) {
        const filePath = path.join(CONVERSATION_LOGS_DIR, file);
        const stat = await fs.stat(filePath);
        logs.push({
          path: filePath,
          name: file,
          type: 'campaign',
          modified: stat.mtime,
          synced_to_notion: true
        });
      }
    }
  } catch (error) {
    // Directory doesn't exist yet
  }

  // Read development logs
  try {
    const devFiles = await fs.readdir(DEVELOPMENT_DIR);
    for (const file of devFiles) {
      if (file.endsWith('.md')) {
        const filePath = path.join(DEVELOPMENT_DIR, file);
        const stat = await fs.stat(filePath);
        logs.push({
          path: filePath,
          name: file,
          type: 'infrastructure',
          modified: stat.mtime,
          synced_to_notion: false
        });
      }
    }
  } catch (error) {
    // Directory doesn't exist yet
  }

  // Sort by modification time and limit
  logs.sort((a, b) => b.modified - a.modified);
  return logs.slice(0, limit);
}

const server = new Server(
  {
    name: 'conversation-tracker',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'log_conversation',
        description: 'Logs a conversation (Q&A) to markdown file with references to source documents',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'The question that was asked',
            },
            answer: {
              type: 'string',
              description: 'The answer provided',
            },
            conversation_type: {
              type: 'string',
              enum: ['campaign', 'infrastructure'],
              description: 'Type of conversation (determines sync to Notion)',
            },
            topic: {
              type: 'string',
              description: 'Topic/title for the conversation log file',
            },
            references: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of file paths referenced in the conversation',
            },
          },
          required: ['question', 'answer', 'conversation_type', 'topic'],
        },
      },
    ],
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'conversation-log://recent',
        name: 'Recent Conversation Logs',
        description: 'Lists the 10 most recent conversation logs',
        mimeType: 'application/json',
      },
    ],
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'conversation-log://recent') {
    const logs = await listRecentLogs(10);
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify(logs, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${request.params.uri}`);
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'log_conversation') {
    const result = await logConversation(
      args.question,
      args.answer,
      args.conversation_type,
      args.topic,
      args.references || []
    );

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Conversation Tracker MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
