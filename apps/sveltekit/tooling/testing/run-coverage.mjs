import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { globSync } from 'tinyglobby';
import { coveragePolicy } from './policy.mjs';
import { reportCoverage } from './report.mjs';
import { coverageScope } from './scope.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const directory = new URL('../../coverage/', import.meta.url);
rmSync(directory, { recursive: true, force: true });
const run = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL('../../node_modules/vitest/vitest.mjs', import.meta.url),
    ),
    'run',
    '--coverage',
    ...process.argv.slice(2),
  ],
  { cwd: root, stdio: 'inherit', env: process.env },
);
const exit = run.status ?? 1;
let summary;
try {
  summary = JSON.parse(
    readFileSync(new URL('coverage-summary.json', directory), 'utf8'),
  );
} catch {
  summary = undefined;
}
const files = globSync(coverageScope.include, {
  cwd: root,
  ignore: coverageScope.exclude,
});
const report = reportCoverage(summary, coveragePolicy, exit, root, files);
mkdirSync(directory, { recursive: true });
writeFileSync(new URL('summary.md', directory), report.markdown);
if (report.available)
  writeFileSync(new URL('report-ready', directory), 'current coverage data\n');
console.log(report.markdown);
process.exitCode = exit || (report.failed ? 1 : 0);
