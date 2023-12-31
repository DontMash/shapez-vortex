import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint } from '$lib/server/blueprint';

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

                        fetch('/api/v1/blueprint/encode', { body: JSON.stringify(data), method: 'post' })
                            .then(encodeResponse => encodeResponse.text())
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            })
                .catch(() => reject(error(400, 'invalid request form data')));
        }),
} satisfies Actions;
