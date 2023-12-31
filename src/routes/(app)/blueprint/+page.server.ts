import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Shape Viewer',
            description: 'View and interact with the 3D visualization of a blueprint. Explore the blueprints\'s multiple layers and parts.',
            keywords: ['Shapez', 'Shapez 2', 'Viewer', '3D', 'Visualization', 'Blueprint', 'Tool'],
            og: {
                title: 'Blueprint Viewer - View and interact with the 3D visualization of a blueprint',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;
