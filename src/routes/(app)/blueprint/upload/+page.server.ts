import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { post } from '$lib/server/blueprint.api';
import { BLUEPRINT_FORM_SCHEMA } from '$lib/blueprint.schema';
import type { BlueprintTag } from '$lib/blueprint.types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.user && !locals.user.verified) {
		redirect(303, '/settings/account');
	}

	const tags = await locals.pb.collection<BlueprintTag>('tags').getFullList();

	return {
		seo: {
			title: 'Upload Blueprint',
			description: 'Share your blueprint with the community.',
			keywords: ['Blueprint', 'Upload']
		},
		form: await superValidate(zod(BLUEPRINT_FORM_SCHEMA)),
		tags
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals, request }) => {
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
			const record = await post(locals.pb, form.data);
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
