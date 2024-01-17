import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { parse } from '$lib/server/shape';
import { SHAPE } from '$lib/shape.types';

export const load = (({ url }) => {
    try {
        const data = parse(url.searchParams.get('identifier') ?? SHAPE);        
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
            shape:
            {
                data,
                extend: url.searchParams.get('extend') === 'true',
                expand: url.searchParams.get('expand') === 'true',
            },
        };
    } catch (err) {
        error(400, (err as Error).message);
    }
}) satisfies PageServerLoad;
