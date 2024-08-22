import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { decode, update } from '$lib/blueprint';

export const load = (() => {
	return {
		seo: {
			title: 'Blueprint Viewer',
			description:
				"View and interact with the 3D visualization of a blueprint. Explore the blueprint's multiple layers and parts.",
			keywords: ['Viewer', '3D', 'Blueprint']
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	view: async ({ request, url }) => {
		const data = await request.formData();
		const identifier = data.get('identifier')?.toString().trim();
		const isUpdate = (data.get('update') ?? 'off') === 'on';
		if (!identifier) return fail(400, { identifier, missing: true });

		let updatedIdentifier = identifier as BlueprintIdentifier;
		if (isUpdate) {
			try {
				updatedIdentifier = update(updatedIdentifier);
			} catch (err) {
				return fail(400, { identifier, invalid: true });
			}
		} else {
			try {
				decode(updatedIdentifier);
			} catch (err) {
				return fail(400, { identifier, invalid: true });
			}
		}

		const viewUrl = new URL('blueprint/view', url.origin);
		viewUrl.searchParams.append('identifier', updatedIdentifier);
		redirect(303, viewUrl);
	},
	upload: async ({ request, url }) => {
		const formData = await request.formData();

		const file = formData.get('file') as File;
		if (!file) return fail(400);

		const buffer = await file.arrayBuffer();
		const codec = new TextDecoder();
		const blueprintIdentifier = codec.decode(buffer);

		if (blueprintIdentifier.length > 12500) {
			return fail(400);
		}

		const blueprintUrl = new URL('/blueprint/view', url.origin);
		blueprintUrl.searchParams.set('identifier', blueprintIdentifier);
		redirect(303, blueprintUrl);
	}
} satisfies Actions;
