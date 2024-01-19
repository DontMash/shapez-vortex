import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Shape Library',
            description: 'View your personal collection of Shapes. View & share shapes\'s with others',
            keywords: ['Shape', 'Library'],
            og: {
                title: 'Shape Library - View & share shapes\'s with others',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;
