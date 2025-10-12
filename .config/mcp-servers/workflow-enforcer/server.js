#!/usr/bin/env node

/**
 * MCP Server: Workflow Enforcer
 *
 * Enforces multi-stage content generation workflows to prevent bypassing approval steps:
 * - Tracks workflow state across sessions (.workflow_state.json)
 * - Requires stages: options → selection → generation → approval
 * - Prevents direct generation without presenting options first
 * - Validates workflow stage transitions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = '.workflow_state.json';

// Valid workflow stages
const WORKFLOW_STAGES = {
  // Stage 1: Present options to user
  PRESENT_OPTIONS: 'present_options',

  // Stage 2: User selects option
  USER_SELECTION: 'user_selection',

  // Stage 3: Generate content based on selection
  GENERATE_CONTENT: 'generate_content',

  // Stage 4: User approves generated content
  USER_APPROVAL: 'user_approval',

  // Stage 5: Save approved content
  SAVE_CONTENT: 'save_content'
};

// Valid workflow transitions
const VALID_TRANSITIONS = {
  [WORKFLOW_STAGES.PRESENT_OPTIONS]: [WORKFLOW_STAGES.USER_SELECTION],
  [WORKFLOW_STAGES.USER_SELECTION]: [WORKFLOW_STAGES.GENERATE_CONTENT, WORKFLOW_STAGES.PRESENT_OPTIONS],
  [WORKFLOW_STAGES.GENERATE_CONTENT]: [WORKFLOW_STAGES.USER_APPROVAL, WORKFLOW_STAGES.PRESENT_OPTIONS],
  [WORKFLOW_STAGES.USER_APPROVAL]: [WORKFLOW_STAGES.SAVE_CONTENT, WORKFLOW_STAGES.GENERATE_CONTENT],
  [WORKFLOW_STAGES.SAVE_CONTENT]: [WORKFLOW_STAGES.PRESENT_OPTIONS] // Can start new workflow
};

/**
 * Load workflow state from disk
 */
async function loadWorkflowState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid - return empty state
    return {
      workflows: {},
      last_updated: null
    };
  }
}

/**
 * Save workflow state to disk
 */
async function saveWorkflowState(state) {
  state.last_updated = new Date().toISOString();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Start a new workflow
 */
async function startWorkflow(workflowType, context = {}) {
  const state = await loadWorkflowState();

  const workflowId = `${workflowType}_${Date.now()}`;

  state.workflows[workflowId] = {
    type: workflowType,
    current_stage: WORKFLOW_STAGES.PRESENT_OPTIONS,
    created_at: new Date().toISOString(),
    context: context,
    history: [{
      stage: WORKFLOW_STAGES.PRESENT_OPTIONS,
      timestamp: new Date().toISOString()
    }]
  };

  await saveWorkflowState(state);

  return {
    workflow_id: workflowId,
    current_stage: WORKFLOW_STAGES.PRESENT_OPTIONS,
    required_next_stage: WORKFLOW_STAGES.USER_SELECTION,
    message: `Workflow started: ${workflowType}. You must present options to the user before generating content.`
  };
}

/**
 * Transition workflow to next stage
 */
async function transitionWorkflow(workflowId, nextStage, context = {}) {
  const state = await loadWorkflowState();

  const workflow = state.workflows[workflowId];
  if (!workflow) {
    return {
      allowed: false,
      error: `Workflow not found: ${workflowId}. Start a new workflow first.`
    };
  }

  const currentStage = workflow.current_stage;
  const validNextStages = VALID_TRANSITIONS[currentStage] || [];

  if (!validNextStages.includes(nextStage)) {
    return {
      allowed: false,
      error: `Invalid transition from ${currentStage} to ${nextStage}. Valid transitions: ${validNextStages.join(', ')}`,
      current_stage: currentStage,
      valid_next_stages: validNextStages
    };
  }

  // Update workflow state
  workflow.current_stage = nextStage;
  workflow.context = { ...workflow.context, ...context };
  workflow.history.push({
    stage: nextStage,
    timestamp: new Date().toISOString(),
    context: context
  });

  await saveWorkflowState(state);

  const validNextStages2 = VALID_TRANSITIONS[nextStage] || [];

  return {
    allowed: true,
    workflow_id: workflowId,
    current_stage: nextStage,
    valid_next_stages: validNextStages2,
    message: `Transitioned to ${nextStage}`
  };
}

/**
 * Get workflow status
 */
async function getWorkflowStatus(workflowId) {
  const state = await loadWorkflowState();

  const workflow = state.workflows[workflowId];
  if (!workflow) {
    return {
      found: false,
      error: `Workflow not found: ${workflowId}`
    };
  }

  const validNextStages = VALID_TRANSITIONS[workflow.current_stage] || [];

  return {
    found: true,
    workflow_id: workflowId,
    type: workflow.type,
    current_stage: workflow.current_stage,
    valid_next_stages: validNextStages,
    created_at: workflow.created_at,
    context: workflow.context,
    history: workflow.history
  };
}

/**
 * List active workflows
 */
async function listActiveWorkflows() {
  const state = await loadWorkflowState();

  const active = Object.entries(state.workflows)
    .filter(([id, workflow]) => workflow.current_stage !== WORKFLOW_STAGES.SAVE_CONTENT)
    .map(([id, workflow]) => ({
      workflow_id: id,
      type: workflow.type,
      current_stage: workflow.current_stage,
      created_at: workflow.created_at
    }));

  return {
    active_workflows: active,
    count: active.length
  };
}

/**
 * Complete workflow (mark as done)
 */
async function completeWorkflow(workflowId) {
  const state = await loadWorkflowState();

  const workflow = state.workflows[workflowId];
  if (!workflow) {
    return {
      success: false,
      error: `Workflow not found: ${workflowId}`
    };
  }

  if (workflow.current_stage !== WORKFLOW_STAGES.SAVE_CONTENT) {
    return {
      success: false,
      error: `Cannot complete workflow in stage ${workflow.current_stage}. Must be in ${WORKFLOW_STAGES.SAVE_CONTENT}`
    };
  }

  workflow.completed_at = new Date().toISOString();
  await saveWorkflowState(state);

  return {
    success: true,
    message: `Workflow ${workflowId} completed successfully`
  };
}

/**
 * Validate that a tool call is allowed in current workflow
 */
async function validateToolCall(toolName, workflowId, expectedStage) {
  const state = await loadWorkflowState();

  const workflow = state.workflows[workflowId];
  if (!workflow) {
    return {
      allowed: false,
      error: `No active workflow. Start a workflow before calling ${toolName}`
    };
  }

  if (workflow.current_stage !== expectedStage) {
    return {
      allowed: false,
      error: `Tool ${toolName} requires stage ${expectedStage}, but workflow is in ${workflow.current_stage}`,
      current_stage: workflow.current_stage,
      expected_stage: expectedStage
    };
  }

  return {
    allowed: true,
    workflow_id: workflowId,
    current_stage: workflow.current_stage
  };
}

const server = new Server(
  {
    name: 'workflow-enforcer',
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
        name: 'start_workflow',
        description: 'Start a new content generation workflow. Must be called before presenting options to user.',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_type: {
              type: 'string',
              description: 'Type of workflow (e.g., "session_generation", "npc_creation", "location_generation")',
            },
            context: {
              type: 'object',
              description: 'Optional context for the workflow',
            },
          },
          required: ['workflow_type'],
        },
      },
      {
        name: 'transition_workflow',
        description: 'Transition workflow to next stage. Enforces valid stage transitions.',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'ID of the workflow to transition',
            },
            next_stage: {
              type: 'string',
              description: 'Next stage to transition to',
              enum: Object.values(WORKFLOW_STAGES)
            },
            context: {
              type: 'object',
              description: 'Optional context to add to workflow state',
            },
          },
          required: ['workflow_id', 'next_stage'],
        },
      },
      {
        name: 'get_workflow_status',
        description: 'Get current status of a workflow',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'ID of the workflow to check',
            },
          },
          required: ['workflow_id'],
        },
      },
      {
        name: 'list_active_workflows',
        description: 'List all active workflows that are not completed',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'complete_workflow',
        description: 'Mark workflow as completed (only after SAVE_CONTENT stage)',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'ID of the workflow to complete',
            },
          },
          required: ['workflow_id'],
        },
      },
      {
        name: 'validate_tool_call',
        description: 'Validate that a tool call is allowed in current workflow stage',
        inputSchema: {
          type: 'object',
          properties: {
            tool_name: {
              type: 'string',
              description: 'Name of the tool being called',
            },
            workflow_id: {
              type: 'string',
              description: 'ID of the active workflow',
            },
            expected_stage: {
              type: 'string',
              description: 'Expected workflow stage for this tool',
              enum: Object.values(WORKFLOW_STAGES)
            },
          },
          required: ['tool_name', 'workflow_id', 'expected_stage'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'start_workflow') {
    const result = await startWorkflow(args.workflow_type, args.context || {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'transition_workflow') {
    const result = await transitionWorkflow(args.workflow_id, args.next_stage, args.context || {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'get_workflow_status') {
    const result = await getWorkflowStatus(args.workflow_id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'list_active_workflows') {
    const result = await listActiveWorkflows();
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'complete_workflow') {
    const result = await completeWorkflow(args.workflow_id);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === 'validate_tool_call') {
    const result = await validateToolCall(args.tool_name, args.workflow_id, args.expected_stage);
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
  console.error('Workflow Enforcer MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
