import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/server/blueprint';

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
    view: ({ request, url }) => new Promise<void>((_, reject) => {
        request.formData().then(formData => {
            if (!formData)
                error(400, 'invalid/missing form data');

            const identifier = formData.get('identifier') as BlueprintIdentifier;
            const isUpdate = (formData.get('update') ?? 'off') === 'on';
            if (!identifier)
                error(400, 'invalid/missing form data: identifier');

            const viewUrl = new URL('blueprint/view', url.origin);
            viewUrl.searchParams.append('identifier', isUpdate ? update(identifier) : identifier);
            redirect(301, viewUrl);
        }).catch(reject);
    })
} satisfies Actions;
