import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Converter',
            description: 'Convert existing blueprints to a specific game version',
            keywords: ['Shapez', 'Shapez 2', 'Blueprint', 'Modify', 'Decode', 'Encode'],
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
    modify: ({ request }) => new Promise<string>(
        (resolve) => {
            request.formData()
                .then(data => {
                    const versionData = data.get('blueprint-version');
                    const blueprintIdentifier = data.get('blueprint-identifier');
                    if (!versionData || !blueprintIdentifier)
                        error(400, 'invalid/missing form data entries');

                    const version = +versionData;
                    const identifier = blueprintIdentifier as BlueprintIdentifier;
                    try {
                        return resolve(update(identifier, version));
                    } catch (err) {
                        error(400, 'invalid blueprint identifier');
                    }
                })
                .catch(() => error(400, 'invalid request form data'));
        }),
} satisfies Actions;
