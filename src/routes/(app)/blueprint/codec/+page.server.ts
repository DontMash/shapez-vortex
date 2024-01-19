import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint, BlueprintIdentifier } from '$lib/blueprint.types';
import { decode, encode } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Codec',
            description: 'Decode or encode existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
            keywords: ['Blueprint', 'Modify', 'Decode', 'Encode'],
            og: {
                title: 'Blueprint Code - Decode or encode existing blueprints',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    decode: async ({ request }) => {
        const data = await request.formData();
        const blueprintIdentifier = data.get('blueprint-identifier');
        if (!blueprintIdentifier)
            return fail(400, { blueprintIdentifier, missing: true });

        try {
            const blueprint = decode(blueprintIdentifier as BlueprintIdentifier);
            return { blueprint, success: true };
        } catch (err) {
            return fail(400, { blueprintIdentifier, invalid: true });
        }
    },

    encode: async ({ request }) => {
        const data = await request.formData();
        const blueprintData = data.get('blueprint-data');
        if (!blueprintData)
            return fail(400, { blueprintData, missing: true });

        const blueprint = JSON.parse(blueprintData as string) as Blueprint;
        try {
            const blueprintIdentifier = encode(blueprint);
            return { blueprintIdentifier, success: true };
        } catch (err) {
            return fail(400, { blueprint, invalid: true });
        }
    }
} satisfies Actions;
