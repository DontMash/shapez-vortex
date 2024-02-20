import type { PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Shape Library',
            description: 'View your personal collection of Shapes. View & share shapes\'s with others',
            keywords: ['Shape', 'Library'],
        },
    };
}) satisfies PageServerLoad;
