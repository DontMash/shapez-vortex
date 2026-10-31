import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import {
  coveragePolicy,
  coverageThresholds,
} from './tooling/testing/policy.mjs';
import { coverageScope } from './tooling/testing/scope.mjs';

const nodeTests = [
  'tooling/**/*.test.js',
  'src/**/server/**/*.{test,spec}.{js,ts}',
  'src/**/*.server.{test,spec}.{js,ts}',
  'src/**/+server.{test,spec}.{js,ts}',
  '../pocketbase/pb_hooks/**/*.{test,spec}.js',
];

export default defineConfig({
  assetsInclude: ['**/*.vs', '**/*.fs'],
  plugins: [tailwindcss(), sveltekit()],
  test: {
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
      ...coverageScope,
      allowExternal: true,
      excludeAfterRemap: true,
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: 'coverage',
      reportOnFailure: true,
      thresholds: coverageThresholds(coveragePolicy),
    },
  },
});
