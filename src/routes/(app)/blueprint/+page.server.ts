import { error, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Viewer',
            description: 'View and interact with the 3D visualization of a blueprint. Explore the blueprints\'s multiple layers and parts.',
            keywords: ['Shapez', 'Shapez 2', 'Viewer', '3D', 'Visualization', 'Blueprint', 'Tool'],
            og: {
                title: 'Blueprint Viewer - View and interact with the 3D visualization of a blueprint',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        },
    };
}) satisfies PageServerLoad;

export const actions = {
    upload: ({ request, url }) => new Promise<void>(
        (_, reject) => {
            request.formData().then(formData => {
                if (!formData)
                    return reject(error(400, 'invalid/missing form data'));

                const file = formData.get('file') as File;
                if (!file)
                    return reject(error(400, 'invalid/missing form data: file'));

                file.arrayBuffer().then(buffer => {
                    const codec = new TextDecoder();
                    const blueprintIdentifier = codec.decode(buffer);

                    const viewUrl = new URL('blueprint/view', url.origin);
                    viewUrl.searchParams.append('identifier', blueprintIdentifier);
                    throw redirect(301, viewUrl);
                }).catch(reject);
            }).catch(reject);
        }),
} satisfies Actions;
