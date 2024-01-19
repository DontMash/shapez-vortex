import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Converter',
            description: 'Convert existing blueprints to a specific game version',
            keywords: ['Blueprint', 'Convert', 'Update', 'Decode', 'Encode'],
            og: {
                title: 'Blueprint Converter - Convert existing blueprints to a specific game version',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ request }) => {
        const data = await request.formData();
        const versionData = data.get('blueprint-version');
        const blueprintIdentifier = data.get('blueprint-identifier');
        if (!versionData)
            return fail(400, { versionData, missing: true });
        if (!blueprintIdentifier)
            return fail(400, { blueprintIdentifier, missing: true });

        const version = +versionData;
        const identifier = blueprintIdentifier as BlueprintIdentifier;
        try {
            return ({ identifier: update(identifier, version) });
        } catch (err) {
            return fail(400, { identifier, invalid: true });
        }
    }
} satisfies Actions;
