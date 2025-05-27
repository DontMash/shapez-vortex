import type { Actions, PageServerLoad } from './$types';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { post } from '$lib/server/blueprint.api';
import { BLUEPRINT_FORM_SCHEMA } from '$lib/blueprint.schema';
import type { BlueprintTag } from '$lib/blueprint.types';
import z from 'zod';

export const load = (async ({ locals }) => {
  if (locals.user && !locals.user.verified) {
    redirect(303, '/settings/account');
  }

  const tags = await locals.pb.collection<BlueprintTag>('tags').getFullList();

  const schema = z.object({
    // title: z.string(),
    // description: BLUEPRINT_DESCRIPTION_SCHEMA.optional(),
    // data: BLUEPRINT_DATA_SCHEMA,
    // images: BLUEPRINT_IMAGES_SCHEMA.optional(),
    // tags: BLUEPRINT_TAGS_SCHEMA.optional(),
  });
  const validator = zod(schema);

  return {
    seo: {
      title: 'Upload Blueprint',
      description: 'Share your blueprint with the community.',
      keywords: ['Blueprint', 'Upload'],
    },
    form: await superValidate(validator),
    tags,
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
          ? Object.entries(error.cause as object).map(
              ([key, value]) => `${key}: ${value}`,
            )
          : error.message,
      );
    }
  },
} satisfies Actions;
