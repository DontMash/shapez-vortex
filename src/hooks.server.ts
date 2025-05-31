import { type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
import type { User } from '$lib/user.types';

export const handle: Handle = async ({ event, resolve }) => {
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
