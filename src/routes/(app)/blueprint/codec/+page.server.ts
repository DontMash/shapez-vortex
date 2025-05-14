import type { PageServerLoad } from './$types';

export const load = (() => {
  return {
    seo: {
      title: 'Blueprint Codec',
      description:
        'Decode or encode existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
      keywords: ['Blueprint', 'Modify', 'Decode', 'Encode'],
    },
  };
}) satisfies PageServerLoad;
