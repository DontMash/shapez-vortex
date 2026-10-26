import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const readEnvTest = (): Record<string, string> => {
  const path = resolve(process.cwd(), '.env.test');
  if (!existsSync(path)) return {};
  const result: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) {
      result[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  return result;
};

export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.vs', '**/*.fs'],
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    env: mode === 'test' ? readEnvTest() : {},
  },
}));
