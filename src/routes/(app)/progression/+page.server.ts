import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        seo: {
            title: 'Progression Editor',
            description: 'Provides the ability to view, create, update and share a progression configuration for the game.',
        },
    };
}) satisfies PageServerLoad;
