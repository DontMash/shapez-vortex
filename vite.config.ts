import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  assetsInclude: ['**/*.vs', '**/*.fs'],
  plugins: [tailwindcss(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
