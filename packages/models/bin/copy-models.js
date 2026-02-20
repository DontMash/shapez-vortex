#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Parse args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: copy-models <destination-directory>');
  process.exit(1);
}

const destDir = path.resolve(process.cwd(), args[0]);

// Resolve paths relative to this script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(__dirname, '../static/models');

console.log(`Copying models from ${sourceDir} to ${destDir}...`);

try {
  // Use cpSync recursively
  fs.cpSync(sourceDir, destDir, { recursive: true });
  console.log('Models copied successfully!');
} catch (error) {
  console.error('Error copying models:', error);
  process.exit(1);
}
