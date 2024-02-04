import type { PageServerLoad } from './$types';

import RESEARCH_DATA from '$lib/assets/data/research-metadata.json';

export const load = (() => {
    return {
        seo: {
            title: 'Research Overview',
            description: 'View a visual representation of the research tree.',
            keywords: ['Research', 'Overview', 'Goal', 'Shape'],
        },
        research: RESEARCH_DATA.Levels,
    };
}) satisfies PageServerLoad;
