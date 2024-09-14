import PocketBase from 'pocketbase';
import { error } from '@sveltejs/kit';
import { POCKETBASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';
import { BLUEPRINT_FILE_FORMAT, type BlueprintRecord } from '$lib/blueprint.types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const blueprint = await locals.pb.collection('blueprints').getOne<BlueprintRecord>(params.id);

	if (locals.user && locals.user.verified && locals.user.id !== blueprint.creator) {
		const pb = new PocketBase(POCKETBASE_URL);
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
		await pb.collection('blueprints').update(params.id, { 'downloadCount+': 1 });
	}

	const codec = new TextEncoder();
	const data = codec.encode(blueprint.data);
	const name = blueprint.title.replace(/\s+/gi, '_');

	return new Response(data, {
		headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${name}${BLUEPRINT_FILE_FORMAT}"`
		}
	});
};
