import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const appDir = fileURLToPath(new URL('..', import.meta.url));
let envDir: string;

const loadConfig = (
  mode = 'test',
  overrides: Record<string, string> = {},
): { env: Record<string, string>; originalUrl?: string } => {
  const environment = { ...process.env };
  delete environment.POCKETBASE_URL;
  Object.assign(environment, overrides);

  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `
        import { loadConfigFromFile } from 'vite';
        process.chdir(${JSON.stringify(envDir)});
        const loaded = await loadConfigFromFile(
          { command: 'serve', mode: ${JSON.stringify(mode)} },
          ${JSON.stringify(join(appDir, 'vite.config.ts'))},
        );
        console.log(JSON.stringify({
          env: loaded.config.test.env,
          originalUrl: process.env.POCKETBASE_URL,
        }));
      `,
    ],
    { cwd: appDir, env: environment, encoding: 'utf8', timeout: 30_000 },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr);
  return JSON.parse(result.stdout.trim().split('\n').at(-1) ?? '');
};

beforeEach(() => {
  envDir = mkdtempSync(join(tmpdir(), 'shapez-vortex-env-'));
});

afterEach(() => {
  rmSync(envDir, { recursive: true, force: true });
});

describe('test environment configuration', () => {
  it('uses no test-file overrides when the file is missing', () => {
    expect(loadConfig()).toEqual({ env: {} });
  });

  it('preserves shell configuration when the test file is missing', () => {
    expect(
      loadConfig('test', { POCKETBASE_URL: 'http://127.0.0.1:8100' }),
    ).toEqual({
      env: {},
      originalUrl: 'http://127.0.0.1:8100',
    });
  });

  it('excludes shared and other mode-specific env files from test-backend configuration', () => {
    for (const file of [
      '.env',
      '.env.local',
      '.env.development',
      '.env.test.local',
    ]) {
      writeFileSync(
        join(envDir, file),
        'POCKETBASE_URL=http://127.0.0.1:8099\n',
      );
    }

    expect(loadConfig()).toEqual({ env: {} });
  });

  it.each(['development', 'production'])(
    'leaves %s configuration unchanged by the test file',
    (mode) => {
      writeFileSync(
        join(envDir, '.env.test'),
        'POCKETBASE_URL=http://127.0.0.1:8099\n',
      );

      expect(loadConfig(mode)).toEqual({ env: {} });
    },
  );

  it('allows an empty shell value to disable the real test backend', () => {
    writeFileSync(
      join(envDir, '.env.test'),
      'POCKETBASE_URL=http://127.0.0.1:8099\n',
    );

    expect(loadConfig('test', { POCKETBASE_URL: '' })).toEqual({
      env: { POCKETBASE_URL: '' },
      originalUrl: '',
    });
  });

  it('lets shell and CI values override the test file', () => {
    writeFileSync(
      join(envDir, '.env.test'),
      'POCKETBASE_URL=http://127.0.0.1:8099\n',
    );

    expect(
      loadConfig('test', { POCKETBASE_URL: 'http://127.0.0.1:8100' }),
    ).toEqual({
      env: { POCKETBASE_URL: 'http://127.0.0.1:8100' },
      originalUrl: 'http://127.0.0.1:8100',
    });
  });

  it('parses quoted values and inline comments without preloading the process environment', () => {
    writeFileSync(
      join(envDir, '.env.test'),
      'POCKETBASE_URL="http://127.0.0.1:8099" # test backend\n',
    );

    expect(loadConfig()).toEqual({
      env: { POCKETBASE_URL: 'http://127.0.0.1:8099' },
    });
  });
});
