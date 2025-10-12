#!/usr/bin/env node

/**
 * File Watcher - Auto-sync markdown files to Notion on change
 *
 * This runs in the background and monitors all campaign markdown files.
 * When a file is modified, it automatically syncs to Notion.
 */

import chokidar from 'chokidar';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const campaignRoot = path.join(__dirname, '..');

// Map paths to entity types
const pathToType = {
  'Player_Characters/': 'PC',
  'NPCs/': 'NPC',
  'Factions/': 'Faction',
  'Locations/': 'Location',
  'Sessions/': 'Session',
  'Campaign_Core/': 'Artifact',
  'Dungeon_Ecologies/': 'Ecology',
  'Session_Flows/': 'Session',
  'Resources/': 'Resource',
  '.working/conversation_logs/': 'Conversation'
};

// Load .notionignore patterns
function loadNotionIgnore() {
  const ignoreFilePath = path.join(campaignRoot, '.notionignore');

  if (!fs.existsSync(ignoreFilePath)) {
    return [];
  }

  const content = fs.readFileSync(ignoreFilePath, 'utf-8');
  const patterns = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  return patterns;
}

// Check if file should be ignored based on .notionignore patterns
function shouldIgnore(filePath, patterns) {
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const pattern of patterns) {
    // Handle directory patterns (ending with /**)
    if (pattern.endsWith('/**')) {
      const dirPattern = pattern.slice(0, -3);
      if (normalizedPath.startsWith(dirPattern)) {
        return true;
      }
    }
    // Handle wildcard patterns
    else if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      if (regex.test(normalizedPath)) {
        return true;
      }
    }
    // Handle exact matches
    else if (normalizedPath.includes(pattern) || normalizedPath.endsWith(pattern)) {
      return true;
    }
  }

  return false;
}

function getEntityType(filePath) {
  for (const [pathPattern, type] of Object.entries(pathToType)) {
    if (filePath.includes(pathPattern)) {
      return type;
    }
  }
  return null;
}

function syncFile(filePath, ignorePatterns) {
  // Check if file should be ignored
  if (shouldIgnore(filePath, ignorePatterns)) {
    console.log(`⏭️  Skipped (ignored): ${filePath}`);
    return;
  }

  const entityType = getEntityType(filePath);

  if (!entityType) {
    console.log(`⏭️  Skipping ${filePath} (not a campaign entity)`);
    return;
  }

  console.log(`🔄 Auto-syncing ${filePath} to Notion as ${entityType}...`);

  const syncProcess = spawn('python3', ['sync_notion.py', filePath, entityType], {
    cwd: campaignRoot,
    stdio: 'inherit'
  });

  syncProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Synced: ${filePath}`);
    } else {
      console.error(`❌ Sync failed for ${filePath} (exit code: ${code})`);
    }
  });
}

console.log('👀 File watcher started...');
console.log('📁 Monitoring campaign markdown files for changes\n');

// Load .notionignore patterns
const ignorePatterns = loadNotionIgnore();
console.log(`📋 Loaded ${ignorePatterns.length} ignore patterns from .notionignore\n`);

// Watch all markdown files in campaign directories
const watcher = chokidar.watch('**/*.md', {
  ignored: [
    '**/node_modules/**',
    '**/.git/**'
  ],
  persistent: true,
  cwd: campaignRoot,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
});

watcher
  .on('change', (filePath) => {
    console.log(`\n📝 File changed: ${filePath}`);
    syncFile(filePath, ignorePatterns);
  })
  .on('add', (filePath) => {
    console.log(`\n✨ New file: ${filePath}`);
    syncFile(filePath, ignorePatterns);
  })
  .on('error', (error) => {
    console.error(`❌ Watcher error: ${error}`);
  });

console.log('✅ Ready - watching for file changes...\n');

// Keep process running
process.on('SIGINT', () => {
  console.log('\n👋 File watcher stopped');
  process.exit(0);
});
