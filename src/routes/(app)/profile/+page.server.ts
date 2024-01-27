import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Profile',
            description: 'Your place for shapez content related to you',
            keywords: ['Blueprint', 'Library', 'Shape'],
            og: {
                title: 'Profile - Your place for shapez content related to you',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;
