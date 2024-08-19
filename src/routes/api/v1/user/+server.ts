import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const displayname = url.searchParams.get('displayname');
	const filter = [`displayname~"${displayname ?? ''}"`];
    
	const users = await locals.pb
		.collection('users')
		.getList(1, 100, { fields: 'displayname', filter: filter.join('&&') });
	return json(users);
};
