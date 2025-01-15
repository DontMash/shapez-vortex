import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BLUEPRINT_VIEW_SCHEMA } from '$lib/blueprint.schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    seo: {
      title: 'Blueprint Viewer',
      description:
        "View and interact with the 3D visualization of a blueprint. Explore the blueprint's multiple layers and parts.",
      keywords: ['Viewer', '3D', 'Blueprint'],
    },
    form: await superValidate(zod(BLUEPRINT_VIEW_SCHEMA)),
  };
}) satisfies PageServerLoad;

export const actions = {
  view: async ({ request, url }) => {
    const form = await superValidate(request, zod(BLUEPRINT_VIEW_SCHEMA));
    if (!form.valid) {
      return fail(400, form);
    }

    const viewUrl = new URL('blueprint/view', url.origin);
    viewUrl.searchParams.append('identifier', form.data.identifier);
    redirect(303, viewUrl);
  },
} satisfies Actions;
