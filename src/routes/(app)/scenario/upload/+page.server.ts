import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { SCENARIO_SCHEMA } from '$lib/scenario.schema';
import type { ScenarioTag } from '$lib/scenario.types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.user && !locals.user.verified) {
		redirect(303, '/settings/account');
	}

	const tags = await locals.pb.collection<ScenarioTag>('scenarioTags').getFullList();

	return {
		seo: {
			title: 'Upload Scenario',
			description: 'Share your scenario with the community.',
			keywords: ['Scenario', 'Upload']
		},
		form: await superValidate(zod(SCENARIO_SCHEMA)),
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

		const form = await superValidate(request, zod(SCENARIO_SCHEMA));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		try {
			console.log(form);

			// redirect(303, `/scenario/${record.id}`);
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
