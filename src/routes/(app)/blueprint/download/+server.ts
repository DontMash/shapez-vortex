import PocketBase from 'pocketbase';
import { error } from '@sveltejs/kit';
import { POCKETBASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';
import { BLUEPRINT_FILE_FORMAT, type BlueprintData } from '$lib/blueprint.types';

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id');
    let identifier;
    let name = 'blueprint';
    if (id) {
        const pb = new PocketBase(POCKETBASE_URL);
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        await pb.collection('blueprints').update(id, { 'downloadCount+': 1 });

        const blueprint = await pb.collection('blueprints').getOne<BlueprintData>(id);
        identifier = blueprint.data;
        name = blueprint.title.replace(/\s+/gi, '_');
    } else {
        identifier = url.searchParams.get('identifier');
        if (!identifier) {
            error(400, 'Invalid/missing identifier query parameter');
        }
    }

    const codec = new TextEncoder();
    const data = codec.encode(identifier);

    return new Response(data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${name}${BLUEPRINT_FILE_FORMAT}"`
        }
    });
};
