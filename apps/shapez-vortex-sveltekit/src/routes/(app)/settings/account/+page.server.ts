import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { USER_REGISTER_FORM_SCHEMA } from '$lib/user.schema';

const USER_UPDATE_SCHEMA = USER_REGISTER_FORM_SCHEMA.pick({ email: true });

export const load = (async () => {
  const form = await superValidate(zod(USER_UPDATE_SCHEMA));

  return {
    seo: {
      title: 'Settings - Account',
      description: 'Manage your account settings',
      keywords: ['Settings', 'Account'],
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  verification: async ({ locals }) => {
    if (!locals.user) {
      return fail(401);
    }

    await locals.pb.collection('users').requestVerification(locals.user.email);
    return { success: true };
  },
  email: async ({ locals, request }) => {
    const form = await superValidate(request, zod(USER_UPDATE_SCHEMA));

    if (!locals.user) {
      return fail(401, { form });
    }

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await locals.pb.collection('users').requestEmailChange(form.data.email);
      return redirect(303, '/login');
    } catch {
      return fail(500, { form });
    }
  },
} satisfies Actions;
