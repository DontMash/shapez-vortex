import { fail } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { ADMIN_EMAIL, ADMIN_PASSWORD, POCKETBASE_URL } from '$env/static/private';
import type { BlueprintRecord } from '$lib/blueprint.types';
import { REPORT_CREATE_SCHEMA } from '$lib/report.types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	updateBookmark: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401);
		}

		const isBookmarked = locals.user.bookmarks.includes(params.id);
		const pb = new PocketBase(POCKETBASE_URL);
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
		if (isBookmarked) {
			await locals.pb.collection('users').update(locals.user.id, { 'bookmarks-': params.id });
			await pb.collection('blueprints').update(params.id, { 'bookmarkCount-': 1 });
		} else {
			await locals.pb.collection('users').update(locals.user.id, { 'bookmarks+': params.id });
			await pb.collection('blueprints').update(params.id, { 'bookmarkCount+': 1 });
		}

		return { success: true };
	},
	deleteBlueprint: async ({ locals, params, url }) => {
		if (!locals.user) {
			return fail(401);
		}

		const formData = new FormData();
		formData.set('id', params.id);
		const deleteUrl = new URL('/api/v1/blueprint', url.origin);
		const response = await fetch(deleteUrl, { method: 'delete', body: formData });
		if (!response.ok) {
			return fail(400, { issues: { id: 'Failed to delete blueprint' } });
		}

		return { success: true };
	},
	reportBlueprint: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401);
		}
		if (!locals.user.verified) {
			return fail(403);
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

		const blueprint = await locals.pb
			.collection<BlueprintRecord>('blueprints')
			.getOne(result.data.blueprint);
		if (locals.user.id === blueprint.creator) {
			return fail(403);
		}

		await locals.pb.collection('blueprintReports').create({ ...result.data, user: locals.user.id });
		return { success: true };
	}
} satisfies Actions;
