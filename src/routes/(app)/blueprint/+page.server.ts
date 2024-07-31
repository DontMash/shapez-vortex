import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { decode, update } from '$lib/server/blueprint';

export const load = (() => {
    return {
        seo: {
            title: 'Blueprint Viewer',
            description: 'View and interact with the 3D visualization of a blueprint. Explore the blueprints\'s multiple layers and parts.',
            keywords: ['Viewer', '3D', 'Blueprint'],
        },
    };
}) satisfies PageServerLoad;

export const actions = {
    view: async ({ request, url }) => {
        const data = await request.formData();
        const identifier = data.get('identifier')?.toString().trim();;
        const isUpdate = (data.get('update') ?? 'off') === 'on';
        if (!identifier)
            return fail(400, { identifier, missing: true });

        let updatedIdentifier = identifier as BlueprintIdentifier;
        if (isUpdate) {
            try {
                updatedIdentifier = update(updatedIdentifier);
            } catch (err) {
                return fail(400, { identifier, invalid: true });
            }
        } else {
            try {
                decode(updatedIdentifier);
            } catch (err) {
                return fail(400, { identifier, invalid: true });
            }
        }

        const viewUrl = new URL('blueprint/view', url.origin);
        viewUrl.searchParams.append('identifier', updatedIdentifier);
        redirect(303, viewUrl);
    }
} satisfies Actions;
