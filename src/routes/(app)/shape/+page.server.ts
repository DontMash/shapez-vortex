import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SHAPE, type ShapeData } from '$lib/shape.types';
import { getColors, getLayerCount, parse, getQuarterCount, getTypes, random } from '$lib/server/shape';

export const load = (({ url }) => {
    try {
        const identifier = url.searchParams.get('identifier') ?? SHAPE;
        const data = parse(identifier);
        const shape: ShapeData = {
            identifier,
            data,
            meta: {
                types: getTypes(data),
                colors: getColors(data),
                layerCount: getLayerCount(data),
                quarterCount: getQuarterCount(data),
            },
        };
        return {
            seo: {
                title: 'Shape Viewer',
                description: 'View and interact with the 3D visualization of a shape. Explore the shape\'s multiple layers and parts.',
                keywords: ['Viewer', '3D', 'Shape'],
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

export const actions = {
    random: ({ url }) => {
        const identifier = random();
        url.searchParams.set('identifier', identifier);
        redirect(301, url);
    }
} satisfies Actions;
