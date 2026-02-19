import { type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

import { dev } from '$app/environment';
import { POCKETBASE_URL } from '$env/static/private';

import type { User } from '$lib/user.schema';

const CHROME_DEV_TOOLS_PATH =
  '/.well-known/appspecific/com.chrome.devtools.json' as const;

export const handle: Handle = async ({ event, resolve }) => {
  if (dev && event.url.pathname === CHROME_DEV_TOOLS_PATH) {
    return new Response(undefined, { status: 404 });
  }

  const pb = new PocketBase(POCKETBASE_URL);
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  event.locals.pb = pb;
  try {
    const valid =
      event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection('users').authRefresh());
    if (valid) {
      event.locals.user = structuredClone(pb.authStore.record) as User;
    }
  } catch {
    event.locals.pb.authStore.clear();
    event.locals.user = undefined;
  }

  const response = await resolve(event);
  response.headers.set('set-cookie', pb.authStore.exportToCookie());
  return response;
};
