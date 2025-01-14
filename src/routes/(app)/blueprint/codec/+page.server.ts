import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Blueprint, BlueprintIdentifier } from '$lib/blueprint.types';
import { decode, encode } from '$lib/blueprint';

export const load = (() => {
  return {
    seo: {
      title: 'Blueprint Codec',
      description:
        'Decode or encode existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
      keywords: ['Blueprint', 'Modify', 'Decode', 'Encode'],
    },
  };
}) satisfies PageServerLoad;

export const actions = {
  decode: async ({ request }) => {
    const data = await request.formData();
    const blueprintIdentifier = data.get('blueprint-identifier') as string;
    if (!blueprintIdentifier)
      return fail(400, { blueprintIdentifier, missing: true });

    try {
      const blueprint = decode(
        blueprintIdentifier.trim() as BlueprintIdentifier,
      );
      return { blueprint, success: true };
    } catch (err) {
      return fail(400, { blueprintIdentifier, invalid: true });
    }
  },

  encode: async ({ request }) => {
    const data = await request.formData();
    const blueprintData = data.get('blueprint-data');
    if (!blueprintData) return fail(400, { blueprintData, missing: true });

    try {
      const blueprint = JSON.parse(blueprintData as string) as Blueprint;
      const blueprintIdentifier = encode(blueprint);
      return { blueprintIdentifier, success: true };
    } catch (err) {
      return fail(400, { blueprintData, invalid: true });
    }
  },
} satisfies Actions;
