import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Library',
            description: 'View your personal collection of blueprints. View & share blueprints\'s with others',
            keywords: ['Blueprint', 'Library'],
            og: {
                title: 'Blueprint Library - View & share blueprints\'s with others',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;
