import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        seo: {
            title: 'Shapez Vortex',
            description: 'The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.',
        },
        user: locals.user,
    };
}) satisfies LayoutServerLoad;