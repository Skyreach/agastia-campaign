#!/usr/bin/env node
/**
 * Test script for quest generation functionality
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test 1: Quest with all parameters provided
const test1 = {
  quest_type: 'mixed',
  location: 'Ratterdan',
  patron_npc: 'The Patron',
  num_nodes: 5,
  completion_time_days: 7,
  base_monster: 'Storm Giant',
  export_mermaid: true
};

// Test 2: Quest with missing parameters (should return suggestions)
const test2 = {
  quest_type: 'travel'
};

console.log('='.repeat(60));
console.log('Quest Generation Test Suite');
console.log('='.repeat(60));
console.log();

console.log('Test 1: Full quest generation with Mermaid export');
console.log('Parameters:', JSON.stringify(test1, null, 2));
console.log();
console.log('Expected: Complete quest with 5 nodes and Mermaid diagram');
console.log();

console.log('Test 2: Partial quest generation (missing parameters)');
console.log('Parameters:', JSON.stringify(test2, null, 2));
console.log();
console.log('Expected: Suggestions for locations, NPCs, monsters, time, and node count');
console.log();

console.log('='.repeat(60));
console.log('Manual Testing Instructions:');
console.log('='.repeat(60));
console.log();
console.log('1. Ensure MCP server is running (should auto-start with Claude Code)');
console.log('2. Use the MCP tool "generate_quest" with the following examples:');
console.log();
console.log('Example 1 (Full quest):');
console.log(JSON.stringify(test1, null, 2));
console.log();
console.log('Example 2 (Get suggestions):');
console.log(JSON.stringify(test2, null, 2));
console.log();
console.log('3. Verify the output includes:');
console.log('   - Quest summary with all nodes');
console.log('   - Travel time for each node');
console.log('   - Success/Failure/Abandon outcomes');
console.log('   - Rewards for each node');
console.log('   - Mermaid diagram (if export_mermaid: true)');
console.log();
console.log('4. Test Mermaid diagram by copying output to:');
console.log('   https://mermaid.live/');
console.log();
