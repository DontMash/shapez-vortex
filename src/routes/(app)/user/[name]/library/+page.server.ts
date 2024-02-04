import type { PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Library',
            description: 'View your personal collection of blueprints & shapes. View & share them with others',
            keywords: ['Blueprint', 'Library', 'Shape'],
        },
    };
}) satisfies PageServerLoad;
