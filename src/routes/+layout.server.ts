import UAParser from 'ua-parser-js';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, request }) => {
    let agent;
    const userAgent = request.headers.get('user-agent');
    if (userAgent) {
        const parser = new UAParser(userAgent);
        agent = parser.getResult();
    }

    return {
        seo: {
            title: 'Shapez Vortex',
            description: 'The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.',
        },
        user: locals.user,
        agent,
    };
}) satisfies LayoutServerLoad;
