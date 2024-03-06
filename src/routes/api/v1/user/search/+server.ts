import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const displayname = url.searchParams.get('displayname');
    if (!displayname) {
        return new Response(JSON.stringify({ items: [] }));
    }
    const users = await locals.pb.collection('users').getList(1, 20, { fields: 'username,displayname', filter: `displayname~"${displayname}"` });
    return new Response(JSON.stringify(users));
};
