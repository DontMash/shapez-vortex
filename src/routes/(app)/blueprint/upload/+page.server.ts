import { fail, redirect } from '@sveltejs/kit';
import type { ZodError } from 'zod';
import type { BlueprintRecord, BlueprintTag } from '$lib/blueprint.types';
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
		tags
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ fetch, locals, request, url }) => {
		if (locals.user && !locals.user.verified) {
			redirect(303, '/settings/account');
		}
		if (!locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const entries = { ...Object.fromEntries(formData), images: formData.getAll('images') };
		const createUrl = new URL('/api/v1/blueprint', url.origin);
		const response = await fetch(createUrl, { method: 'post', body: formData });
		if (!response.ok) {
			const error = (await response.json()) as ZodError;
			const issues = error.issues.reduce<Record<string, string>>((result, current) => {
				result[current.path[0]] = current.message;
				return result;
			}, {});
			return fail(400, { data: { ...entries, images: undefined }, issues, invalid: true });
		}

		const record = (await response.json()) as BlueprintRecord;
		redirect(303, `/blueprint/${record.id}`);
	}
} satisfies Actions;
