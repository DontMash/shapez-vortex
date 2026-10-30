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

export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.vs', '**/*.fs'],
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    env: mode === 'test' ? readEnvTest() : {},
  },
}));
