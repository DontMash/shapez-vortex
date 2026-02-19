import type { LayoutServerLoad } from './$types';
import type { ListResult } from 'pocketbase';
import UAParser from 'ua-parser-js';
import type { BlueprintRecord } from '$lib/blueprint';
import { get } from '$lib/server/blueprint.api';
import type { User } from '$lib/user.schema';

export const load = (async ({ fetch, locals, request, url }) => {
  let agent;
  const userAgent = request.headers.get('user-agent');
  if (userAgent) {
    const parser = new UAParser(userAgent);
    agent = parser.getResult();
  }

  // fetch the latest 100 blueprints for client-side search
  let searchBlueprints: Array<BlueprintRecord> = [];
  try {
    const result = await get(locals.pb, { query: '', perPage: 100 });
    searchBlueprints = result.items;
  } catch {
    searchBlueprints = [];
  }

  // fetch the latest 100 users for client-side search
  let searchUsers: Array<User> = [];
  try {
    const displayname = url.searchParams.get('displayname');
    const filter = [`displayname~"${displayname ?? ''}"`];
    const result = await locals.pb
      .collection('users')
      .getList(1, 100, { fields: 'displayname', filter: filter.join('&&') });

    const users = result as ListResult<User>;
    searchUsers = users.items;
  } catch {
    searchUsers = [];
  }
  return {
    seo: {
      title: 'Shapez Vortex',
      description:
        'The purpose of this project is to provide a suite of tools to visualize and modify data used by or generated from the game.',
    },
    user: locals.user,
    agent,
    searchBlueprints,
    searchUsers,
  };
}) satisfies LayoutServerLoad;
