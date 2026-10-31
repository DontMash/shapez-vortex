import { fileURLToPath } from 'node:url';

export const coverageScope = {
  include: [
    'src/**/*.{js,ts,svelte}',
    fileURLToPath(
      new URL('../../../pocketbase/pb_hooks/*.js', import.meta.url),
    ).replaceAll('\\', '/'),
  ],
  exclude: [
    '**/*.d.ts',
    '**/*.{test,spec}.{js,ts}',
    '**/{__tests__,__fixtures__,test-support}/**',
    'src/lib/components/models/{buildings,shapes}/**',
    'src/lib/components/models/Error.svelte',
    'src/lib/style/typography.js',
  ],
};
