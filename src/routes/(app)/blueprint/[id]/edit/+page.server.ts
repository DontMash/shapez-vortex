import { fail, redirect } from '@sveltejs/kit';
import type { ZodError } from 'zod';
import type { BlueprintRecord } from '$lib/blueprint.types';
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

	return {
		seo: {
			title: `Edit blueprint - ${data.blueprint.entry.title}`,
			description: 'Update your blueprint with new or more information.'
		}
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
		const updateUrl = new URL('/api/v1/blueprint', url.origin);
		const response = await fetch(updateUrl, { method: 'put', body: formData });
		if (!response.ok) {
			const error = (await response.json()) as ZodError;
			const issues = error.issues.reduce<Record<string, string>>((result, current) => {
				result[current.path[0]] = current.message;
				return result;
			}, {});
			return fail(400, {
				data: { ...Object.entries(formData), images: undefined },
				issues,
				invalid: true
			});
		}

		const record = (await response.json()) as BlueprintRecord;
		redirect(303, `/blueprint/${record.id}`);
	}
} satisfies Actions;
