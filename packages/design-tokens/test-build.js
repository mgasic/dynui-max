#!/usr/bin/env node
/**
 * Test script to validate Style Dictionary configuration and token build
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

console.log('🧪 Testing Style Dictionary build...');

// Test that config file exists
const configPath = join(__dirname, 'build', 'config.js');
if (!existsSync(configPath)) {
  console.error('❌ Config file not found:', configPath);
  process.exit(1);
}
console.log('✅ Config file exists');

// Test actual build process
const buildProcess = spawn('pnpm', ['build:tokens'], {
  cwd: __dirname,
  stdio: 'pipe'
});

let output = '';
let hasError = false;

buildProcess.stdout.on('data', (data) => {
  output += data.toString();
});

buildProcess.stderr.on('data', (data) => {
  output += data.toString();
  if (data.toString().includes('Error:')) {
    hasError = true;
  }
});

buildProcess.on('close', (code) => {
  if (code === 0 && !hasError) {
    console.log('✅ Style Dictionary build successful!');
    
    // Check generated files
    const artifactChecks = [
      { label: 'CSS tokens', path: join(__dirname, 'dist', 'tokens.css') },
      { label: 'JS tokens', path: join(__dirname, 'dist', 'tokens.js') },
      { label: 'Light theme CSS', path: join(__dirname, 'dist', 'themes', 'light.css') },
      { label: 'Dark theme CSS', path: join(__dirname, 'dist', 'themes', 'dark.css') }
    ];

    const artifactStatuses = artifactChecks.map(({ label, path }) => ({
      label,
      path,
      exists: existsSync(path)
    }));

    const missingArtifacts = artifactStatuses.filter(({ exists }) => !exists);

    if (missingArtifacts.length > 0) {
      for (const { label, path, exists } of artifactStatuses) {
        const status = exists ? '✅' : '❌';
        const message = exists ? `${status} ${label} generated` : `${status} ${label} not found at ${path}`;
        console[exists ? 'log' : 'error'](message);
      }

      console.error('❌ Build is missing required artifacts');
      process.exit(1);
    }

    for (const { label } of artifactStatuses) {
      console.log(`✅ ${label} generated`);
    }

    console.log('🎉 All tests passed!');
  } else {
    console.error('❌ Style Dictionary build failed');
    console.error('Output:');
    console.error(output);
    process.exit(1);
  }
});