import type { PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Shapez Visualizer',
            description: 'The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.',
            keywords: ['Shapez', 'Shapez 2', 'Visualization', 'Tools'],
        }
    };
}) satisfies PageServerLoad;
