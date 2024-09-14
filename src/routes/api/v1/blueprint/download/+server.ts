import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

export const GET: RequestHandler = async ({ url }) => {
	let identifier;
	let name = 'blueprint';
	identifier = url.searchParams.get('identifier');
	if (!identifier) {
		error(400, 'Invalid/missing identifier query parameter');
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
