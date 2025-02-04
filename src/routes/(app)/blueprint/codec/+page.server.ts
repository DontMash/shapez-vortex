import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { decode, encode } from '$lib/blueprint';
import {
  BLUEPRINT_DECODE_SCHEMA,
  BLUEPRINT_ENCODE_SCHEMA,
} from '$lib/blueprint.schema';
import type { Blueprint, BlueprintIdentifier } from '$lib/blueprint.types';

export const load = (async () => {
  const decodeForm = await superValidate(zod(BLUEPRINT_DECODE_SCHEMA));
  const encodeForm = await superValidate(zod(BLUEPRINT_ENCODE_SCHEMA));

  return {
    seo: {
      title: 'Blueprint Codec',
      description:
        'Decode or encode existing blueprints. Make changes within the blueprint to customize it according to your specific requirements.',
      keywords: ['Blueprint', 'Modify', 'Decode', 'Encode'],
    },
    decodeForm,
    encodeForm,
  };
}) satisfies PageServerLoad;

export const actions = {
  decode: async ({ request }) => {
    const decodeForm = await superValidate(
      request,
      zod(BLUEPRINT_DECODE_SCHEMA),
    );

    if (!decodeForm.valid) return fail(400, { decodeForm });

    const blueprintIdentifier = decodeForm.data.identifier;
    try {
      const blueprint = decode(
        blueprintIdentifier.trim() as BlueprintIdentifier,
      );
      return message(decodeForm, blueprint);
    } catch {
      return fail(400, { decodeForm });
    }
  },

  encode: async ({ request }) => {
    const encodeForm = await superValidate(
      request,
      zod(BLUEPRINT_ENCODE_SCHEMA),
    );

    if (!encodeForm.valid) return fail(400, { decodeForm: encodeForm });

    const blueprint = JSON.parse(encodeForm.data.data) as Blueprint;
    try {
      const blueprintIdentifier = encode(blueprint);
      return message(encodeForm, blueprintIdentifier);
    } catch {
      return fail(400, { encodeForm });
    }
  },
} satisfies Actions;
