import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { USER_REGISTER_FORM_SCHEMA } from '$lib/user.types';

const USER_UPDATE_SCHEMA = USER_REGISTER_FORM_SCHEMA.pick({ displayname: true });

export const load = (async () => {
  const form = await superValidate(zod(USER_UPDATE_SCHEMA))

  return {
    seo: {
      title: 'Settings - Profile',
      description: 'Manage your profile settings',
      keywords: ['Settings', 'Profile'],
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ locals, request }) => {
    const form = await superValidate(request, zod(USER_UPDATE_SCHEMA))

    if (!locals.user) {
      return fail(401, { form });
    }
    if (!locals.user.verified) {
      return fail(403, { form });
    }

    if (!form.valid) {
      return fail(400, { form });
    }

    await locals.pb.collection('users').update(locals.user.id, {
      displayname: form.data.displayname,
    });
    return { form };
  },
} satisfies Actions;
