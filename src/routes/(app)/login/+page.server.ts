import type { ClientResponseError } from 'pocketbase';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { USER_LOGIN_FORM_SCHEMA } from '$lib/user.types';

export const load = (({ locals }) => {
	if (locals.user) {
		redirect(303, 'user');
	}
	return {
		seo: {
			title: 'Login',
			description: 'Login to access more features and share content for the shapez community'
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ locals, request }) => {
		const formData = await request.formData();
		const entries = Object.fromEntries(formData);
		const result = USER_LOGIN_FORM_SCHEMA.safeParse(entries);
		if (!result.success) {
			return fail(400, { data: entries, issues: result.error.issues, invalid: true });
		}
		try {
			await locals.pb
				.collection('users')
				.authWithPassword(result.data.username, result.data.password);

			redirect(303, result.data.redirect ?? 'user');
		} catch (err) {
			if (isRedirect(err)) {
				throw err;
			}
		}
	}
} satisfies Actions;
