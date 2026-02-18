import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csrf: {
      trustedOrigins: [
        'https://shapez.soren.codes',
        'https://community-vortex.shapez2.com',
        'https://vortex.shapez2.io',
      ],
    },
    version: {
      name: process.env.npm_package_version,
    },
  },
};

export default config;
