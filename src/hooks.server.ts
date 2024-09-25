import PocketBase from 'pocketbase';
import { redirect, type Handle } from '@sveltejs/kit';
import { POCKETBASE_URL } from '$env/static/private';
import type { User } from '$lib/user.types';

const protectedRoutes = ['settings', 'blueprint/upload', 'scenario/upload'] as const;
const protectedActions = [
	'requestVerification',
	'requestEmail',
	'updateDisplayname',
	'updateBookmark'
] as const;

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase(POCKETBASE_URL);
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	event.locals.pb = pb;
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
		event.locals.user = structuredClone(pb.authStore.model) as User;
	} catch {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	const isProtectedRoute =
		protectedRoutes.filter((route) => event.url.pathname.startsWith(`/${route}`)).length > 0;
	const isProtectedAction =
		event.request.method === 'POST' &&
		protectedActions.filter((action) => event.url.searchParams.has(`/${action}`)).length > 0;
	const isProtected = isProtectedRoute || isProtectedAction;
	if (isProtected && !event.locals.user) {
		const loginUrl = new URL('login', event.url.origin);
		loginUrl.searchParams.set('redirect', event.url.pathname);
		redirect(303, loginUrl.href);
	}

	const response = await resolve(event);
	response.headers.set('set-cookie', pb.authStore.exportToCookie());
	return response;
};
