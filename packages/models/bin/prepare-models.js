#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageDir = join(__dirname, "..");

const args = process.argv.slice(2);
const command = args[0] || "all";

console.log(`Starting models pipeline (${command})...`);

const proc = spawn("bun", ["run", "resources/scripts/pipeline.ts", command], {
  cwd: packageDir,
  stdio: "inherit",
});

proc.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Pipeline failed with exit code ${code}`);
    process.exit(code);
  }
  console.log("Pipeline finished successfully.");
});
