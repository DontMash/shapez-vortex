#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prepareScript = join(__dirname, 'prepare-models.js');
const copyScript = join(__dirname, 'copy-models.js');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: models <destination-directory>');
  process.exit(1);
}

console.log('Running prepare-models...');
const prepareProc = spawn('node', [prepareScript, 'all'], { stdio: 'inherit' });

prepareProc.on('exit', (code) => {
  if (code !== 0) {
    console.error(`prepare-models failed with exit code ${code}`);
    process.exit(code);
  }

  console.log('\nRunning copy-models...');
  const copyProc = spawn('node', [copyScript, ...args], { stdio: 'inherit' });

  copyProc.on('exit', (copyCode) => {
    if (copyCode !== 0) {
      console.error(`copy-models failed with exit code ${copyCode}`);
      process.exit(copyCode);
    }
    console.log('\nAll model scripts completed successfully!');
  });
});
