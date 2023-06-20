import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    const identifier = url.searchParams.get('identifier');
    if (!identifier) return {};

    return {
        shape: {
            identifier
        }
    };
}) satisfies PageServerLoad;
