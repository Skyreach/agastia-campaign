#!/usr/bin/env node

/**
 * File Watcher - Auto-sync markdown files to Notion on change
 *
 * Watches campaign-content/ directory and calls auto_sync_wrapper.py
 * which infers entity type from directory name.
 */

import chokidar from 'chokidar';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const campaignRoot = path.join(__dirname, '..');

function syncFile(filePath) {
  console.log(`🔄 File changed: ${filePath}`);

  // Call auto_sync_wrapper.py which handles entity type inference
  const syncProcess = spawn('python3', ['.config/auto_sync_wrapper.py', filePath], {
    cwd: campaignRoot,
    stdio: 'inherit'
  });

  syncProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Synced: ${filePath}\n`);
    } else {
      console.error(`❌ Sync failed for ${filePath} (exit code: ${code})\n`);
    }
  });
}

console.log('👀 File watcher started...');
console.log('📁 Monitoring campaign-content/ for changes\n');

// Watch only campaign-content directory
const watcher = chokidar.watch('campaign-content/**/*.md', {
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
    syncFile(filePath);
  })
  .on('add', (filePath) => {
    console.log(`✨ New file: ${filePath}`);
    syncFile(filePath);
  })
  .on('error', (error) => {
    console.error(`❌ Watcher error: ${error}`);
  });

console.log('✅ Ready - watching for file changes in campaign-content/\n');

// Keep process running
process.on('SIGINT', () => {
  console.log('\n👋 File watcher stopped');
  process.exit(0);
});
