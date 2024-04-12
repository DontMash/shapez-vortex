import PocketBase from 'pocketbase';
import { error } from '@sveltejs/kit';
import { POCKETBASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';
import { BLUEPRINT_FILE_FORMAT, type BlueprintRecord } from '$lib/blueprint.types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const id = url.searchParams.get('id');
    let identifier;
    let name = 'blueprint';
    if (id) {
        const blueprint = await locals.pb.collection('blueprints').getOne<BlueprintRecord>(id);

        if (locals.user && locals.user.verified && locals.user.id !== blueprint.creator) {
            const pb = new PocketBase(POCKETBASE_URL);
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
            await pb.collection('blueprints').update(id, { 'downloadCount+': 1 });
        }

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
