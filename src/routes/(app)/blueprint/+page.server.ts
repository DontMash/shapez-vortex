import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint } from '$lib/server/blueprint';

export const load = (({ url }) => {
    return {
        seo: {
            title: 'Blueprint Transformer',
            description: 'Decode, encode or modify existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
            keywords: ['Shapez', 'Shapez 2', 'Blueprint', 'Modify', 'Decode', 'Encode'],
            og: {
                title: 'Blueprint Transformer - Decode, encode or modify existing blueprints',
                type: 'website',
                image: `${url.origin}/favicon.png`,
                url: url.href,
            },
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    modify: ({ request, fetch }) => new Promise<string>(
        (resolve, reject) => {
            request.formData().then(data => {
                const versionData = data.get('blueprint-version');
                const blueprintData = data.get('blueprint-identifier');
                if (!versionData || !blueprintData)
                    return reject(error(400, 'invalid/missing form data entries'));

                const version = +versionData;
                const blueprint = blueprintData as string;
                fetch('/api/v1/blueprint/decode', { body: blueprint.trim(), method: 'post' })
                    .then(decodeResponse => {
                        if (!decodeResponse.ok) return reject(error(400, 'invalid blueprint identifier'));
                        return decodeResponse.json();
                    })
                    .then(value => {
                        const data = value as Blueprint;
                        data.V = version;

                        fetch('api/v1/blueprint/encode', { body: JSON.stringify(data), method: 'post' })
                            .then(encodeResponse => encodeResponse.text())
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            })
                .catch(() => reject(error(400, 'invalid request form data')));
        }),

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
