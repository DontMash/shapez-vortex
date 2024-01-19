import type { PageServerLoad } from './$types';

import RESEARCH_DATA from '$lib/assets/data/research-metadata.json';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Research Overview',
            description: 'View a visual representation of the research tree.',
            keywords: ['Research', 'Overview', 'Goal', 'Shape'],
            og: {
                title: 'Research Overview - View a visual representation of the research tree',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
        research: RESEARCH_DATA.Levels,
    };
}) satisfies PageServerLoad;
