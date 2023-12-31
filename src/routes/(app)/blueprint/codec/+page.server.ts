import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint } from '$lib/blueprint.types';

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
    decode: ({ request, fetch }) => new Promise<Blueprint>(
        (resolve, reject) => {
            request.formData().then(data => {
                const blueprintData = data.get('blueprint-identifier');
                if (!blueprintData)
                    return reject(error(400, 'invalid/missing form data entries'));

                const blueprint = blueprintData as string;
                fetch('/api/v1/blueprint/decode', { body: blueprint.trim(), method: 'post' })
                    .then(response => {
                        if (!response.ok) return reject(error(400, 'invalid blueprint identifier'));
                        return response.json();
                    })
                    .then(resolve)
                    .catch(reject);
            })
                .catch(() => reject(error(400, 'invalid request form data')));
        }),

    encode: ({ request, fetch }) => new Promise<string>(
        (resolve, reject) => {
            request.formData().then(data => {
                const blueprintData = data.get('blueprint-data');
                if (!blueprintData)
                    return reject(error(400, 'invalid/missing form data entries'));

                const blueprint = blueprintData as string;
                fetch('/api/v1/blueprint/encode', { body: blueprint.trim(), method: 'post' })
                    .then(response => {
                        if (!response.ok) {
                            reject(error(400, 'invalid blueprint data'));
                            return '';
                        }
                        return response.text();
                    })
                    .then(resolve)
                    .catch(reject);
            })
                .catch(() => reject(error(400, 'invalid request form data')));
        })
} satisfies Actions;
