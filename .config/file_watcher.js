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
  'Resources/': 'Resource'
};

function getEntityType(filePath) {
  for (const [pathPattern, type] of Object.entries(pathToType)) {
    if (filePath.includes(pathPattern)) {
      return type;
    }
  }
  return null;
}

function syncFile(filePath) {
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

// Watch all markdown files in campaign directories
const watcher = chokidar.watch('**/*.md', {
  ignored: [
    '**/node_modules/**',
    '**/.git/**',
    '**/README.md',
    '**/CLAUDE.md',
    '**/COMMANDS.md',
    '**/.config/**'
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
    syncFile(filePath);
  })
  .on('add', (filePath) => {
    console.log(`\n✨ New file: ${filePath}`);
    syncFile(filePath);
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
