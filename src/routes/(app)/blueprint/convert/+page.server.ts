import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { update } from '$lib/blueprint';

export const load = (() => {
  return {
    seo: {
      title: 'Blueprint Converter',
      description: 'Convert existing blueprints to a specific game version',
      keywords: ['Blueprint', 'Convert', 'Update', 'Decode', 'Encode'],
    },
  };
}) satisfies PageServerLoad;

export const actions = {
  update: async ({ request }) => {
    const data = await request.formData();
    const versionData = data.get('blueprint-version');
    const blueprintIdentifier = data.get('blueprint-identifier') as string;
    if (!versionData) return fail(400, { versionData, missing: true });
    if (!blueprintIdentifier)
      return fail(400, { blueprintIdentifier, missing: true });

    const version = +versionData;
    const identifier = blueprintIdentifier.trim() as BlueprintIdentifier;
    try {
      return { success: true, identifier: update(identifier, version) };
    } catch {
      return fail(400, { identifier, invalid: true });
    }
  },
} satisfies Actions;
