import type { PageServerLoad } from './$types';

type Data = {
    seo: {
        title: string;
        description: string;
        keywords?: Array<string>;
        og?: {
            title?: string;
            type: 'website';
            image: string;
            url: string;
        };
    };
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

    const imageUrl = new URL('api/v1/shape', url.origin);
    if (identifier) {
        imageUrl.searchParams.append('identifier', identifier);
    }

    const value: Data = {
        seo: {
            title: 'Shape Viewer',
            description: 'View and interact with the 3D visualization of a shape. Explore the shape\'s multiple layers and parts.',
            keywords: ['Shapez', 'Shapez 2', 'Viewer', '3D', 'Visualization', 'Shape', 'Tool'],
            og: {
                title: 'Shape Viewer - View and interact with the 3D visualization of a shape',
                type: 'website',
                image: imageUrl.href,
                url: url.href,
            },
        },
        shape:
        {
            extend: extend === 'true',
            expand: expand === 'true',
        },
    };
    if (!identifier) return value;

    value.shape.identifier = identifier;
    return value;
}) satisfies PageServerLoad;
