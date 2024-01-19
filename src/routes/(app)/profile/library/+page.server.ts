import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Library',
            description: 'View your personal collection of blueprints & shapes. View & share them with others',
            keywords: ['Blueprint', 'Library', 'Shape'],
            og: {
                title: 'Library - View & share them with others',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;
