import { readFileSync } from 'node:fs';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const { version } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csrf: { trustedOrigins: ['*'] },
    version: {
      name: version,
    },
  },
};

export default config;
