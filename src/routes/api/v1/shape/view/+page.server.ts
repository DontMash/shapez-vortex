import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    const identifier = url.searchParams.get('identifier') ?? undefined;

    return {
        shape: {
            identifier
        }
    };
}) satisfies PageServerLoad;
