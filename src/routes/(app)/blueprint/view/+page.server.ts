import { error, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BLUEPRINT_FILE_FORMAT, type BlueprintString } from '$lib/blueprint.types';
import { buildingCount, cost, decode, isBlueprintString, islandCount } from '$lib/server/blueprint';

const BLUEPRINT = 'SHAPEZ2-1-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$';

export const load = (({ url }) => {
    const identifier = url.searchParams.get('identifier')?.trim() as BlueprintString ?? BLUEPRINT;
    const name = url.searchParams.get('name')?.trim() as string;

    if (!isBlueprintString(identifier)) error(400, 'Invalid blueprint identifier');

    const data = decode(identifier);
    const count = buildingCount(data);
    const meta = {
        name,
        buildingCount: count,
        islandCount: islandCount(data),
        cost: cost(count)
    };

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
        blueprint: {
            identifier,
            data,
            meta,
        },
    };
}) satisfies PageServerLoad;

export const actions = {
    upload: ({ request, url }) => new Promise<void>((_, reject) => {
        request.formData().then(formData => {
            if (!formData)
                error(400, 'invalid/missing form data');

            const file = formData.get('file') as File;
            if (!file)
                error(400, 'invalid/missing form data: file');

            file.arrayBuffer().then(buffer => {
                const codec = new TextDecoder();
                const blueprintIdentifier = codec.decode(buffer);

                url.searchParams.set('identifier', blueprintIdentifier);
                url.searchParams.set('name', file.name.split(BLUEPRINT_FILE_FORMAT)[0])
                redirect(301, url);
            }).catch(reject);
        }).catch(reject);
    })
} satisfies Actions;
