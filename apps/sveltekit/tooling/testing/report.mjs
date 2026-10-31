import { resolve } from 'node:path';
import { minimum } from './policy.mjs';

const metricNames = ['lines', 'statements', 'functions', 'branches'];

export function reportCoverage(
  summary,
  policy,
  testExit,
  root = process.cwd(),
  expectedFiles = [],
) {
  const unavailable = (reason) => ({
    failed: true,
    available: false,
    markdown: `## Coverage\n\nCoverage unavailable: ${reason}\n\nTest/coverage command exit: ${testExit}\n`,
  });
  const validCounts = (counts) =>
    counts &&
    metricNames.every((name) => {
      const entry = counts[name];
      return (
        entry &&
        Number.isInteger(entry.covered) &&
        Number.isInteger(entry.total) &&
        entry.covered >= 0 &&
        entry.total >= entry.covered
      );
    });
  if (!summary || !validCounts(summary.total))
    return unavailable('missing or invalid summary');
  for (const file of expectedFiles) {
    if (!validCounts(summary[resolve(root, file)]))
      return unavailable(`missing source: ${file}`);
  }
  for (const group of policy.completedGroups) {
    if (
      !group.files.length ||
      new Set(group.files).size !== group.files.length
    ) {
      return unavailable(`empty or duplicate ownership: ${group.name}`);
    }
    for (const file of group.files) {
      if (!validCounts(summary[resolve(root, file)]))
        return unavailable(`missing owned source: ${file}`);
    }
  }
  const scopes = [
    { name: 'Global', counts: summary.total, gated: policy.globalGate },
  ];
  for (const group of policy.completedGroups) {
    const counts = Object.fromEntries(
      metricNames.map((name) => [name, { covered: 0, total: 0 }]),
    );
    for (const file of group.files) {
      const entry = summary[resolve(root, file)];
      for (const name of metricNames) {
        counts[name].covered += entry[name].covered;
        counts[name].total += entry[name].total;
      }
    }
    scopes.push({ name: group.name, counts, gated: true });
  }
  const rows = scopes.flatMap((scope) =>
    metricNames.map((name) => {
      const { covered, total } = scope.counts[name];
      const pct =
        total === 0 ? 100 : Math.floor((100000 * covered) / total / 10) / 100;
      const status = scope.gated
        ? pct >= minimum[name]
          ? 'PASS'
          : 'FAIL'
        : 'Baseline';
      return `| ${scope.name} | ${name} | ${pct.toFixed(2)}% | ${covered}/${total} | ${status} |`;
    }),
  );
  return {
    failed: testExit !== 0,
    available: true,
    markdown: [
      '## Coverage',
      '',
      `Test/coverage command: ${testExit === 0 ? 'passed' : `failed (exit ${testExit})`}`,
      `Global gate: ${policy.globalGate ? 'enabled' : 'disabled (rollout baseline)'}`,
      `Completed source groups: ${policy.completedGroups.length}`,
      '',
      '| Scope | Metric | Coverage | Covered/total | Gate |',
      '| --- | --- | --- | --- | --- |',
      ...rows,
      '',
    ].join('\n'),
  };
}
