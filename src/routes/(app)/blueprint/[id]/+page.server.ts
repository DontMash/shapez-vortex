import PocketBase from 'pocketbase';
import { fail } from '@sveltejs/kit';
import { ADMIN_EMAIL, ADMIN_PASSWORD, POCKETBASE_URL } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import { REPORT_CREATE_SCHEMA, type ReportRecord } from '$lib/report.types';

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
    reportBlueprint: async ({ locals, request }) => {
        if (!locals.user) {
            return fail(401);
        }
        if (!locals.user.verified) {
            return fail(403);
        }

        const formData = await request.formData();
        const entries = Object.fromEntries(formData);
        const result = await REPORT_CREATE_SCHEMA.safeParseAsync(entries);
        if (!result.success) {
            const issues = result.error.issues.reduce<Record<string, string>>((result, current) => {
                result[current.path[0]] = current.message;
                return result;
            }, {});
            
            return fail(400, { data: entries, issues, invalid: true });
        }

        await locals.pb.collection('reports').create({ ...result.data, user: locals.user.id });

        return { success: true };
    }
} satisfies Actions;
