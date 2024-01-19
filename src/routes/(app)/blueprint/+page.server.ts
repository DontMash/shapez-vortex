import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Viewer',
            description: 'View and interact with the 3D visualization of a blueprint. Explore the blueprints\'s multiple layers and parts.',
            keywords: ['Viewer', '3D', 'Blueprint'],
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
    view: async ({ request, url }) => {
        const data = await request.formData();
        const identifier = data.get('identifier') as BlueprintIdentifier;
        const isUpdate = (data.get('update') ?? 'off') === 'on';
        if (!identifier)
            return fail(400, { identifier, missing: true });

        const viewUrl = new URL('blueprint/view', url.origin);
        viewUrl.searchParams.append('identifier', isUpdate ? update(identifier) : identifier);
        redirect(301, viewUrl);
    }
} satisfies Actions;
