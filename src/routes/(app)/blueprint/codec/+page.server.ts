import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint, BlueprintString } from '$lib/blueprint.types';
import { decode, encode } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Codec',
            description: 'Decode or encode existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
            keywords: ['Shapez', 'Shapez 2', 'Blueprint', 'Modify', 'Decode', 'Encode'],
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
    decode: ({ request }) => new Promise<Blueprint>(
        (resolve, reject) => {
            request.formData().then(data => {
                const blueprintIdentifier = data.get('blueprint-identifier');
                if (!blueprintIdentifier)
                    return reject(error(400, 'invalid/missing form data entries'));

                try {
                    const data = decode(blueprintIdentifier as BlueprintString);
                    return resolve(data);
                } catch (err) {
                    return reject(error(400, 'invalid blueprint identifier'));
                }
            })
                .catch(() => reject(error(400, 'invalid request form data')));
        }),

    encode: ({ request }) => new Promise<string>(
        (resolve, reject) => {
            request.formData()
                .then(data => {
                    const blueprintData = data.get('blueprint-data');
                    if (!blueprintData)
                        return reject(error(400, 'invalid/missing form data entries'));

                    const blueprint = JSON.parse(blueprintData as string) as Blueprint;
                    try {
                        const identifier = encode(blueprint);
                        return resolve(identifier);
                    } catch (err) {
                        return reject(error(400, 'invalid blueprint data'));
                    }
                })
                .catch(() => reject(error(400, 'invalid request form data')));
        })
} satisfies Actions;
