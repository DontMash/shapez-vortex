import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';

const readEnvTest = (): NodeJS.ProcessEnv => {
  const path = resolve(process.cwd(), '.env.test');
  if (!existsSync(path)) return {};
  const env = parseEnv(readFileSync(path, 'utf-8'));
  for (const key of Object.keys(env)) {
    env[key] = process.env[key] ?? env[key];
  }
  return env;
};

const minimumCoverage = {
  lines: 80,
  statements: 80,
  functions: 80,
  branches: 80,
};
const globalCoverageGate = false;

const nodeTests = [
  'src/**/server/**/*.{test,spec}.{js,ts}',
  'src/**/*.server.{test,spec}.{js,ts}',
  'src/**/+server.{test,spec}.{js,ts}',
];

export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.vs', '**/*.fs'],
  plugins: [tailwindcss(), sveltekit()],
  test: {
    env: mode === 'test' ? readEnvTest() : {},
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', 'github-actions']
      : ['default'],
    environment: 'happy-dom',
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          environment: 'happy-dom',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: nodeTests,
        },
      },
      {
        extends: true,
        test: { name: 'node', environment: 'node', include: nodeTests },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,ts,svelte}'],
      exclude: [
        '**/*.d.ts',
        '**/*.{test,spec}.{js,ts}',
        '**/{__tests__,__fixtures__,test-support}/**',
        'src/lib/components/models/{buildings,shapes}/**',
        'src/lib/components/models/Error.svelte',
        'src/lib/style/typography.js',
      ],
      excludeAfterRemap: true,
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: 'coverage',
      clean: true,
      reportOnFailure: true,
      thresholds: {
        perFile: false,
        'src/lib/blueprint{,.types}.ts': minimumCoverage,
        ...(globalCoverageGate ? minimumCoverage : {}),
      },
    },
  },
}));
