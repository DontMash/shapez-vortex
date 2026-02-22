import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
  const displayname = url.searchParams.get('displayname');
  const filter = [`displayname~"${displayname ?? ''}"`];

  try {
    const result = await locals.pb
      .collection('users')
      .getList(1, 100, { fields: 'displayname', filter: filter.join('&&') });

    return json(result.items);
  } catch {
    return json([], { status: 500 });
  }
};
