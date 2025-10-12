#!/usr/bin/env node

/**
 * MCP Server: File Organizer
 *
 * Enforces proper file naming and componentization:
 * - No version numbers or temporal indicators in filenames
 * - Proper component organization (Type_Specific_Name.md)
 * - Detects cross-cutting concerns before splitting files
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

// Version/temporal indicators to reject
const FORBIDDEN_PATTERNS = [
  /v\d+/i,              // v1, v2, V3
  /_v\d+/i,             // _v1, _v2, _V3 (ADDED from sub-agent feedback)
  /_\d+$/,              // Ending with _1, _2, _3 (ADDED from sub-agent feedback)
  /\d{4}-?\d{2}-?\d{2}/, // 20251012, 2025-10-12
  /\d{6,8}/,            // 20251012, 251012
  /_updated/i,
  /_revised/i,
  /_final/i,
  /_new/i,
  /_old/i,
  /_backup/i,
  /_copy/i,
  /_draft/i,
  /_temp/i,
  /_wip/i,
  /_test/i,             // ADDED from sub-agent feedback
  /\(\d+\)/,            // (1), (2)
  / copy/i,             // ADDED from sub-agent feedback
];

// Valid file type prefixes
const VALID_TYPES = [
  'PC', 'NPC', 'Faction', 'Location', 'Session', 'Artifact',
  'Ecology', 'Resource', 'Quest', 'Item', 'Spell'
];

/**
 * Validate filename against naming conventions
 */
function validateFilename(proposedName, contentType) {
  const errors = [];
  const warnings = [];

  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(proposedName)) {
      errors.push(`Filename contains forbidden pattern: ${pattern}`);
    }
  }

  // Check if starts with valid type
  const hasValidPrefix = VALID_TYPES.some(type => proposedName.startsWith(type + '_'));

  if (!hasValidPrefix && contentType) {
    warnings.push(`Filename should start with type prefix (e.g., ${contentType}_${proposedName})`);
  }

  // Check file extension
  if (!proposedName.endsWith('.md')) {
    errors.push('Filename must end with .md extension');
  }

  // Check for spaces (should use underscores)
  if (proposedName.includes(' ')) {
    errors.push('Filename should use underscores instead of spaces');
  }

  const isValid = errors.length === 0;

  return {
    valid: isValid,
    errors,
    warnings,
    suggested_name: isValid ? proposedName : null
  };
}

/**
 * Detect cross-cutting concerns in content
 */
function checkCrossCuttingConcerns(content) {
  const concerns = [];

  // Check for multiple entity types in one file
  const entityMarkers = {
    'player character': /## PC:|player character/gi,
    'npc': /## NPC:|non-player character/gi,
    'faction': /## Faction:|faction relationship/gi,
    'location': /## Location:|at this location/gi,
    'session': /## Session \d+:|session plan/gi,
  };

  const foundEntities = [];
  for (const [entity, pattern] of Object.entries(entityMarkers)) {
    if (pattern.test(content)) {
      foundEntities.push(entity);
    }
  }

  if (foundEntities.length > 2) {
    concerns.push({
      type: 'multiple_entities',
      entities: foundEntities,
      suggestion: 'Content references multiple entity types - may need splitting'
    });
  }

  // Check for mixed temporal content (multiple sessions/versions)
  const sessionReferences = content.match(/Session \d+/gi);
  if (sessionReferences && new Set(sessionReferences).size > 1) {
    concerns.push({
      type: 'multiple_sessions',
      sessions: [...new Set(sessionReferences)],
      suggestion: 'Content spans multiple sessions - consider session-specific files'
    });
  }

  // Check for large file size (potential componentization candidate)
  const lineCount = content.split('\n').length;
  if (lineCount > 500) {
    concerns.push({
      type: 'large_file',
      line_count: lineCount,
      suggestion: 'File is very large - consider breaking into components'
    });
  }

  return concerns;
}

/**
 * Propose componentization for a bulk file
 */
async function proposeComponentization(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const crossCuttingConcerns = checkCrossCuttingConcerns(content);

    // Simple heuristic: split by H2 headers
    const sections = content.split(/^## /m).filter(s => s.trim());

    const proposedFiles = sections.slice(1).map((section, idx) => {
      const firstLine = section.split('\n')[0];
      const sectionTitle = firstLine.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      const fileName = sectionTitle.replace(/\s+/g, '_');

      return {
        path: path.join(path.dirname(filePath), `${fileName}.md`),
        section_title: sectionTitle,
        reason: `Split from bulk file: ${path.basename(filePath)}`
      };
    });

    return {
      proposed_files: proposedFiles,
      cross_cutting_concerns: crossCuttingConcerns,
      delete_original: crossCuttingConcerns.length === 0,
      requires_user_approval: crossCuttingConcerns.length > 0
    };
  } catch (error) {
    throw new Error(`Failed to analyze file: ${error.message}`);
  }
}

const server = new Server(
  {
    name: 'file-organizer',
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
        name: 'validate_filename',
        description: 'Validates filename against naming conventions (no versions, proper component naming)',
        inputSchema: {
          type: 'object',
          properties: {
            proposed_name: {
              type: 'string',
              description: 'The proposed filename to validate',
            },
            content_type: {
              type: 'string',
              description: 'The type of content (PC, NPC, Faction, Location, etc.)',
            },
          },
          required: ['proposed_name'],
        },
      },
      {
        name: 'check_cross_cutting_concerns',
        description: 'Analyzes content to detect if it belongs in multiple places (cross-cutting concerns)',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The file content to analyze',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'propose_componentization',
        description: 'Analyzes bulk file and proposes how to split into components. Stops if cross-cutting concerns detected.',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the bulk file to analyze',
            },
          },
          required: ['file_path'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'validate_filename') {
    const result = validateFilename(args.proposed_name, args.content_type);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'check_cross_cutting_concerns') {
    const concerns = checkCrossCuttingConcerns(args.content);
    return {
      content: [{ type: 'text', text: JSON.stringify({ concerns }, null, 2) }],
    };
  }

  if (name === 'propose_componentization') {
    const result = await proposeComponentization(args.file_path);
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
  console.error('File Organizer MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
