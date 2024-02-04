import type { PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Blueprint Library',
            description: 'View your personal collection of blueprints. View & share blueprints\'s with others',
            keywords: ['Blueprint', 'Library'],
        },
    };
}) satisfies PageServerLoad;
