import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SHAPE, type ShapeData } from '$lib/shape.types';
import { colors, layerCount, parse, quarterCount, types } from '$lib/server/shape';

export const load = (({ url }) => {
    try {
        const identifier = url.searchParams.get('identifier') ?? SHAPE;
        const data = parse(identifier);
        const shape: ShapeData = {
            identifier,
            data,
            meta: {
                types: types(data),
                colors: colors(data),
                layerCount: layerCount(data),
                quarterCount: quarterCount(data),
            },
        };
        return {
            seo: {
                title: 'Shape Viewer',
                description: 'View and interact with the 3D visualization of a shape. Explore the shape\'s multiple layers and parts.',
                keywords: ['Shapez', 'Shapez 2', 'Viewer', '3D', 'Visualization', 'Shape', 'Tool'],
                og: {
                    title: 'Shape Viewer - View and interact with the 3D visualization of a shape',
                    type: 'website',
                    image: `${url.origin}/favicon.png`,
                    url: url.href,
                },
            },
            shape,
            extend: url.searchParams.get('extend') === 'true',
            expand: url.searchParams.get('expand') === 'true',
        };
    } catch (err) {
        error(400, (err as Error).message);
    }
}) satisfies PageServerLoad;
