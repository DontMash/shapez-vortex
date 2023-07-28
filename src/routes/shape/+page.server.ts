import type { PageServerLoad } from './$types';

type ShapeViewerOptions = {
    shape: {
        identifier?: string;
        extend: boolean;
        expand: boolean;
    };
};

export const load = (({ url }) => {
    const identifier = url.searchParams.get('identifier');
    const extend = url.searchParams.get('extend');
    const expand = url.searchParams.get('expand');

    const value: ShapeViewerOptions = {
        shape:
        {
            extend: extend === 'true',
            expand: expand === 'true',
        }
    };
    if (!identifier) return value;

    value.shape.identifier = identifier;
    return value;
}) satisfies PageServerLoad;
