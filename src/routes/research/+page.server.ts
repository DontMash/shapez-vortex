import type { PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Research Overview',
            description: 'View a visual representation of the research tree.',
            keywords: ['Shapez', 'Shapez 2', 'Research', 'Overview', '3D', 'Visualization', 'Shape'],
        }
    };
}) satisfies PageServerLoad;
