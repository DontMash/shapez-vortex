import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/blueprint';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BLUEPRINT_CONVERT_SCHEMA } from '$lib/blueprint.schema';

export const load = (async () => {
  const form = await superValidate(zod(BLUEPRINT_CONVERT_SCHEMA));

  return {
    seo: {
      title: 'Blueprint Converter',
      description: 'Convert existing blueprints to a specific game version',
      keywords: ['Blueprint', 'Convert', 'Update', 'Decode', 'Encode'],
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  update: async ({ request }) => {
    const form = await superValidate(request, zod(BLUEPRINT_CONVERT_SCHEMA));

    if (!form.valid) return fail(400, { form });

    const identifier = form.data.identifier.trim() as BlueprintIdentifier;
    try {
      return message(form, update(identifier, form.data.version));
    } catch {
      return fail(400, { form });
    }
  },
} satisfies Actions;
