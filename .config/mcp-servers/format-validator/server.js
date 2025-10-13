#!/usr/bin/env node

/**
 * MCP Server: Format Validator
 *
 * Validates entity document format compliance against ENTITY_FORMAT_SPECS.md
 * - Checks frontmatter completeness
 * - Validates required sections
 * - Verifies Notion-compatible markdown
 * - Can launch sub-agent for deep validation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

// Entity type specifications
const ENTITY_SPECS = {
  PC: {
    required_frontmatter: ['name', 'type', 'player', 'race', 'class', 'level', 'status', 'version', 'tags'],
    optional_frontmatter: ['faction', 'related_entities'],
    required_sections: [
      'Player Summary',
      'Basic Information',
      'Appearance',
      'Known Personality Traits',
      'Current Goals',
      'Relationships',
      'Special Items & Abilities',
      'Session History'
    ],
    status_values: ['Active', 'Inactive', 'Dead']
  },
  NPC: {
    required_frontmatter: ['name', 'type', 'status', 'version', 'tags'],
    optional_frontmatter: ['location', 'faction', 'threat_level', 'related_entities'],
    required_sections: [
      'Player Summary',
      'Basic Information',
      'Known Activities',
      'Personality & Behavior',
      'Relationships',
      'DM Notes'
    ],
    status_values: ['Active', 'Inactive', 'Dead', 'Unknown']
  },
  Faction: {
    required_frontmatter: ['name', 'type', 'version', 'status', 'tags', 'related_entities'],
    optional_frontmatter: ['threat_level'],
    required_sections: [
      'Player Summary',
      'DM Notes',
      'Overview',
      'Key Members',
      'Goals & Progress Clocks',
      'Operations',
      'Relationships',
      'Future Hooks',
      'Secrets'
    ],
    status_values: ['Active', 'Dissolved', 'Hidden']
  },
  Location: {
    required_frontmatter: ['name', 'type', 'location_type', 'status', 'version', 'tags'],
    optional_frontmatter: ['parent_location', 'child_locations', 'related_entities'],
    required_sections: [
      'Player Summary',
      'Basic Information',
      'Geography & Features',
      'Notable Residents',
      'DM Notes',
      'Hidden Features',
      'Encounters',
      'Factions Present',
      'Plot Hooks'
    ],
    status_values: ['Active', 'Destroyed', 'Abandoned', 'Accessible'],
    location_types: ['City', 'District', 'Region', 'Town', 'Wilderness', 'Dungeon']
  },
  Quest: {
    required_frontmatter: ['name', 'type', 'quest_type', 'status', 'version', 'tags', 'location', 'related_entities'],
    optional_frontmatter: ['patron'],
    required_sections: [
      'Player Summary',
      'Basic Information',
      'Objectives',
      'Quest Structure',
      'DM Notes',
      'Hidden Information',
      'Alternative Approaches',
      'Consequences'
    ],
    status_values: ['Available', 'Active', 'Completed', 'Failed'],
    quest_types: ['Mission', 'Travel', 'Mixed']
  },
  Artifact: {
    required_frontmatter: ['name', 'type', 'status', 'version', 'tags', 'related_entities'],
    optional_frontmatter: ['current_wielder'],
    required_sections: [
      'Player Summary',
      'Basic Information',
      'Known Properties',
      'Legends & Lore',
      'DM Notes',
      'True Properties',
      'History',
      'Corruption/Curse',
      'Plot Significance'
    ],
    status_values: ['Lost', 'Found', 'Destroyed', 'Wielded']
  },
  Item: {
    required_frontmatter: ['name', 'type', 'item_type', 'rarity', 'version', 'tags'],
    optional_frontmatter: ['current_owner'],
    required_sections: [
      'Description',
      'Properties',
      'Mechanical Effects'
    ],
    status_values: [],
    item_types: ['Weapon', 'Armor', 'Consumable', 'Tool', 'Treasure'],
    rarity_levels: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary']
  }
};

// Forbidden HTML tags
const FORBIDDEN_HTML = [
  /<details>/i,
  /<\/details>/i,
  /<summary>/i,
  /<\/summary>/i,
  /<div>/i,
  /<\/div>/i,
  /<span>/i,
  /<\/span>/i,
  /<br>/i,
  /<br\/>/i,
  /style\s*=/i
];

/**
 * Parse YAML frontmatter from file content
 */
function parseFrontmatter(content) {
  // Normalize line endings to \n
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }
      // Handle quoted strings
      else if ((value.startsWith('"') && value.endsWith('"')) ||
               (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Extract section headings from content
 */
function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      sections.push(match[1].trim());
    }
    const match3 = line.match(/^###\s+(.+)$/);
    if (match3) {
      sections.push(match3[1].trim());
    }
  }

  return sections;
}

/**
 * Validate document format
 */
async function validateDocumentFormat(filePath, entityType, useSubagent = false) {
  const errors = [];
  const warnings = [];
  const info = [];

  try {
    // Read file
    const content = await fs.readFile(filePath, 'utf-8');

    // Get spec for entity type
    const spec = ENTITY_SPECS[entityType];
    if (!spec) {
      errors.push(`Unknown entity type: ${entityType}`);
      return { valid: false, errors, warnings, info };
    }

    // 1. Check frontmatter exists
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
      errors.push('No YAML frontmatter found (must start with --- and end with ---)');
      return { valid: false, errors, warnings, info };
    }

    // 2. Check required frontmatter fields
    for (const field of spec.required_frontmatter) {
      if (!frontmatter[field]) {
        errors.push(`Missing required frontmatter field: ${field}`);
      }
    }

    // 3. Validate frontmatter values
    if (frontmatter.type && frontmatter.type !== entityType) {
      errors.push(`Frontmatter type "${frontmatter.type}" doesn't match expected type "${entityType}"`);
    }

    if (frontmatter.status && spec.status_values.length > 0) {
      if (!spec.status_values.includes(frontmatter.status)) {
        errors.push(`Invalid status value "${frontmatter.status}". Must be one of: ${spec.status_values.join(', ')}`);
      }
    }

    if (frontmatter.version) {
      if (!/^\d+\.\d+\.\d+$/.test(frontmatter.version)) {
        errors.push(`Invalid version format "${frontmatter.version}". Must be semantic versioning (X.Y.Z)`);
      }
    } else {
      warnings.push('Missing version field - recommended for tracking changes');
    }

    // Entity-specific validation
    if (entityType === 'Location' && frontmatter.location_type) {
      if (!spec.location_types.includes(frontmatter.location_type)) {
        errors.push(`Invalid location_type "${frontmatter.location_type}". Must be one of: ${spec.location_types.join(', ')}`);
      }
    }

    if (entityType === 'Quest' && frontmatter.quest_type) {
      if (!spec.quest_types.includes(frontmatter.quest_type)) {
        errors.push(`Invalid quest_type "${frontmatter.quest_type}". Must be one of: ${spec.quest_types.join(', ')}`);
      }
    }

    if (entityType === 'Item' && frontmatter.rarity) {
      if (!spec.rarity_levels.includes(frontmatter.rarity)) {
        errors.push(`Invalid rarity "${frontmatter.rarity}". Must be one of: ${spec.rarity_levels.join(', ')}`);
      }
    }

    // 4. Check H1 title exists and matches name
    const h1Match = content.match(/^# (.+)$/m);
    if (!h1Match) {
      errors.push('No H1 title found (must have exactly one # heading)');
    } else if (frontmatter.name && h1Match[1].trim() !== frontmatter.name) {
      warnings.push(`H1 title "${h1Match[1].trim()}" doesn't match frontmatter name "${frontmatter.name}"`);
    }

    // 5. Check required sections
    const sections = extractSections(content);
    for (const requiredSection of spec.required_sections) {
      if (!sections.some(s => s.includes(requiredSection))) {
        errors.push(`Missing required section: ${requiredSection}`);
      }
    }

    // 6. Check for forbidden HTML
    for (const pattern of FORBIDDEN_HTML) {
      if (pattern.test(content)) {
        errors.push(`Contains forbidden HTML tag: ${pattern}. Use Notion toggles instead (**Toggle: Title**)`);
      }
    }

    // 7. Check for tables (not supported in Notion sync)
    if (/^\|.*\|.*\|$/m.test(content)) {
      const tableCount = (content.match(/^\|.*\|.*\|$/gm) || []).length;
      // Exclude tiered DC format (which uses | for boxed text, single line)
      const tieredDcCount = (content.match(/^\| [^|]+$/gm) || []).length;
      if (tableCount - tieredDcCount > 0) {
        warnings.push('Contains markdown tables - these may not sync properly to Notion. Consider using lists instead.');
      }
    }

    // 8. Information firewall check (Player Summary vs DM Notes)
    const hasPlayerSummary = sections.some(s => s.includes('Player Summary'));
    const hasDMNotes = sections.some(s => s.includes('DM Notes'));

    if (!hasPlayerSummary && hasDMNotes) {
      warnings.push('Has DM Notes but no Player Summary - consider adding player-facing content');
    }

    // 9. Check tags are lowercase
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      const uppercaseTags = frontmatter.tags.filter(tag => /[A-Z]/.test(tag));
      if (uppercaseTags.length > 0) {
        warnings.push(`Tags should be lowercase with hyphens: ${uppercaseTags.join(', ')}`);
      }
    }

    const valid = errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      info: [
        `Entity type: ${entityType}`,
        `Sections found: ${sections.length}`,
        `Frontmatter fields: ${Object.keys(frontmatter).length}`
      ]
    };

  } catch (error) {
    errors.push(`Failed to read file: ${error.message}`);
    return { valid: false, errors, warnings, info };
  }
}

/**
 * Quick format check (minimal validation)
 */
async function quickFormatCheck(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    const checks = {
      has_frontmatter: /^---\n[\s\S]*?\n---/.test(content),
      has_h1_title: /^# .+$/m.test(content),
      has_forbidden_html: FORBIDDEN_HTML.some(pattern => pattern.test(content)),
      has_version: /^version:\s*["']?\d+\.\d+\.\d+["']?/m.test(content)
    };

    const passed = checks.has_frontmatter && checks.has_h1_title && !checks.has_forbidden_html;

    return {
      passed,
      checks,
      suggestion: !passed ? 'Run full validation for detailed errors' : null
    };

  } catch (error) {
    return {
      passed: false,
      checks: {},
      suggestion: `Failed to read file: ${error.message}`
    };
  }
}

const server = new Server(
  {
    name: 'format-validator',
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
        name: 'validate_document_format',
        description: 'Validates entity document format against ENTITY_FORMAT_SPECS.md. Can use sub-agent for deep validation.',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the entity file to validate',
            },
            entity_type: {
              type: 'string',
              description: 'Entity type (PC, NPC, Faction, Location, Quest, Artifact, Item)',
              enum: ['PC', 'NPC', 'Faction', 'Location', 'Quest', 'Artifact', 'Item']
            },
            use_subagent: {
              type: 'boolean',
              description: 'Launch sub-agent for deep validation (default: false)',
              default: false
            }
          },
          required: ['file_path', 'entity_type'],
        },
      },
      {
        name: 'quick_format_check',
        description: 'Quick format check for basic compliance (frontmatter, H1, no HTML). Faster than full validation.',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the file to check',
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

  if (name === 'validate_document_format') {
    if (args.use_subagent) {
      // Return instructions for Claude to launch sub-agent
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            use_subagent: true,
            instructions: `Launch a general-purpose sub-agent with this prompt:

"Read the file at ${args.file_path} and the specification at .config/ENTITY_FORMAT_SPECS.md.

Validate that the ${args.entity_type} entity document complies with all requirements:
1. YAML frontmatter completeness
2. Required sections present
3. Markdown compatibility (no HTML tags)
4. Version format correctness
5. Status value validity
6. Information firewall (Player Summary vs DM Notes)
7. Any entity-specific requirements

Return a detailed validation report with:
- Valid: true/false
- Errors: List of format violations
- Warnings: List of recommendations
- Score: X/10 for format compliance
- Suggestions: Specific fixes needed"

After receiving the sub-agent report, format the results.`
          }, null, 2)
        }]
      };
    } else {
      // Perform direct validation
      const result = await validateDocumentFormat(args.file_path, args.entity_type);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  }

  if (name === 'quick_format_check') {
    const result = await quickFormatCheck(args.file_path);
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
  console.error('Format Validator MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
