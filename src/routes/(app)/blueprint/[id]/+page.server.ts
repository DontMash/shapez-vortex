import PocketBase from 'pocketbase';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_EMAIL, ADMIN_PASSWORD, POCKETBASE_URL } from '$env/static/private';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    updateBookmark: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401);
        }

        const isBookmarked = locals.user.blueprints.includes(params.id);
        const pb = new PocketBase(POCKETBASE_URL);
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        if (isBookmarked) {
            await locals.pb.collection('users').update(locals.user.id, { 'blueprints-': params.id });
            await pb.collection('blueprints').update(
                params.id, { 'bookmarkCount-': 1 });
        } else {
            await locals.pb.collection('users').update(locals.user.id, { 'blueprints+': params.id });
            await pb.collection('blueprints').update(params.id, { 'bookmarkCount+': 1 });
        }

        return { success: true };
    },
    deleteBlueprint: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401);
        }
        if (!locals.user.blueprints.includes(params.id)) {
            return fail(404);
        }

        await locals.pb.collection('blueprints').delete(params.id);

        return { success: true };
    },
} satisfies Actions;
