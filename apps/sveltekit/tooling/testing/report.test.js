import { describe, expect, it } from 'vitest';
import { reportCoverage } from './report.mjs';

const metrics = (covered, total) => ({
  lines: { covered, total },
  statements: { covered, total },
  functions: { covered, total },
  branches: { covered, total },
});
const baseline = { globalGate: false, completedGroups: [] };

describe('coverage reporting and policy', () => {
  it('reports a low global baseline without enabling the global gate', () => {
    const result = reportCoverage({ total: metrics(0, 100) }, baseline, 0);
    expect(result.failed).toBe(false);
    expect(result.markdown).toContain(
      'Global gate: disabled (rollout baseline)',
    );
    for (const metric of ['lines', 'statements', 'functions', 'branches']) {
      expect(result.markdown).toContain(
        `| Global | ${metric} | 0.00% | 0/100 | Baseline |`,
      );
    }
  });

  it('aggregates a completed group by counts, rejects exactly 80%, and retains global totals', () => {
    const result = reportCoverage(
      {
        total: metrics(17, 30),
        '/repo/apps/sveltekit/src/a.ts': metrics(7, 8),
        '/repo/apps/sveltekit/src/b.ts': metrics(9, 12),
      },
      {
        globalGate: false,
        completedGroups: [{ name: 'Example', files: ['src/a.ts', 'src/b.ts'] }],
      },
      1,
      '/repo/apps/sveltekit',
    );
    expect(result.failed).toBe(true);
    expect(result.markdown).toContain(
      '| Example | branches | 80.00% | 16/20 | FAIL |',
    );
    expect(result.markdown).toContain(
      '| Global | lines | 56.66% | 17/30 | Baseline |',
    );
    expect(result.markdown).toContain('Test/coverage command: failed (exit 1)');
  });

  it('marks missing, malformed, and incomplete coverage unavailable rather than passing', () => {
    for (const summary of [undefined, {}, { total: metrics(-1, 100) }]) {
      const result = reportCoverage(summary, baseline, 0);
      expect(result.failed).toBe(true);
      expect(result.markdown).toContain('Coverage unavailable');
      expect(result.markdown).not.toContain('0.00%');
    }
    const missing = reportCoverage(
      { total: metrics(1, 1) },
      baseline,
      0,
      '/repo',
      ['src/a.ts'],
    );
    expect(missing.failed).toBe(true);
    expect(missing.markdown).toContain('src/a.ts');
    expect(missing.markdown).toContain('Coverage unavailable');
  });

  it('renders integer percentages without floating-point undercounting', () => {
    const result = reportCoverage({ total: metrics(57, 100) }, baseline, 0);
    expect(result.markdown).toContain(
      '| Global | lines | 57.00% | 57/100 | Baseline |',
    );
  });

  it('does not accept empty or misspelled completed ownership as a passing group', () => {
    for (const files of [[], ['src/typo.ts'], ['src/a.ts', 'src/a.ts']]) {
      const result = reportCoverage(
        { total: metrics(100, 100), '/repo/src/a.ts': metrics(100, 100) },
        { globalGate: false, completedGroups: [{ name: 'Example', files }] },
        0,
        '/repo',
      );
      expect(result.available).toBe(false);
      expect(result.failed).toBe(true);
    }
  });

  it('shows the explicit global switch and independent metric failures without auto-activation', () => {
    const counts = {
      ...metrics(100, 100),
      branches: { covered: 80, total: 100 },
    };
    const disabled = reportCoverage({ total: metrics(100, 100) }, baseline, 0);
    const enabled = reportCoverage(
      { total: counts },
      { ...baseline, globalGate: true },
      1,
    );
    expect(disabled.markdown).toContain('disabled (rollout baseline)');
    expect(enabled.markdown).toContain('Global gate: enabled');
    expect(enabled.markdown).toContain(
      '| Global | lines | 100.00% | 100/100 | PASS |',
    );
    expect(enabled.markdown).toContain(
      '| Global | branches | 80.00% | 80/100 | FAIL |',
    );
  });
});
