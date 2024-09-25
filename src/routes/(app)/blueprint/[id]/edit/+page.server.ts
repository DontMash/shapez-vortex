import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { put } from '$lib/server/blueprint.api';
import { BLUEPRINT_FORM_SCHEMA } from '$lib/blueprint.schema';
import type { BlueprintTag } from '$lib/blueprint.types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, parent, url }) => {
	if (!locals.user) {
		const loginUrl = new URL('login', url.origin);
		loginUrl.searchParams.set('redirect', url.pathname);
		redirect(303, loginUrl.href);
	}
	const data = await parent();
	if (locals.user.id !== data.blueprint.entry.creator) {
		redirect(303, `/blueprint/${data.blueprint.entry.id}`);
	}
	if (!locals.user.verified) {
		redirect(303, '/settings/account');
	}

	const tags = await locals.pb.collection<BlueprintTag>('blueprintTags').getFullList();

	return {
		seo: {
			title: `Edit blueprint - ${data.blueprint.entry.title}`,
			description: 'Update your blueprint with new or more information.'
		},
		form: await superValidate(zod(BLUEPRINT_FORM_SCHEMA)),
		tags
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals, request, params }) => {
		if (locals.user && !locals.user.verified) {
			redirect(303, '/settings/account');
		}
		if (!locals.user) {
			return fail(401);
		}

		const form = await superValidate(request, zod(BLUEPRINT_FORM_SCHEMA));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		try {
			const record = await put(locals.pb, params.id, form.data);
			redirect(303, `/blueprint/${record.id}`);
		} catch (err) {
			const error = err as Error;
			if (isRedirect(error)) throw error;
			return setError(
				form,
				'data',
				error.cause
					? Object.entries(error.cause as object).map(([key, value]) => `${key}: ${value}`)
					: error.message
			);
		}
	}
} satisfies Actions;
