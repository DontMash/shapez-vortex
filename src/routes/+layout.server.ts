import type { ListResult } from 'pocketbase';
import UAParser from 'ua-parser-js';
import type { LayoutServerLoad } from './$types';
import type { BlueprintRecord } from '$lib/blueprint.types';
import type { User } from '$lib/user.types';

export const load = (async ({ locals, request, url }) => {
	let agent;
	const userAgent = request.headers.get('user-agent');
	if (userAgent) {
		const parser = new UAParser(userAgent);
		agent = parser.getResult();
	}

	// fetch the latest 100 blueprints for client-side search
	let searchBlueprints: Array<BlueprintRecord> = [];
	const blueprintUrl = new URL('/api/v1/blueprint', url.origin);
	blueprintUrl.searchParams.append('perPage', String(100));
	try {
		const response = await fetch(blueprintUrl);
		if (!response.ok) {
			throw new Error('Invalid blueprint fetch', { cause: response });
		}
		const result = (await response.json()) as ListResult<BlueprintRecord>;
		searchBlueprints = result.items;
	} catch (err) {
		console.error(err);
	}

	// fetch the latest 100 users for client-side search
	let searchUsers: Array<User> = [];
	const userUrl = new URL('/api/v1/user', url.origin);
	userUrl.searchParams.append('perPage', String(100));
	try {
		const response = await fetch(userUrl);
		if (!response.ok) {
			throw new Error('Invalid user fetch', { cause: response });
		}
		const result = (await response.json()) as ListResult<User>;
		searchUsers = result.items;
	} catch (err) {
		console.error(err);
	}	

	return {
		seo: {
			title: 'Shapez Vortex',
			description:
				'The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.'
		},
		user: locals.user,
		agent,
		searchBlueprints,
		searchUsers
	};
}) satisfies LayoutServerLoad;
