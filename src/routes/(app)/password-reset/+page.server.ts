import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { USER_REGISTER_FORM_SCHEMA } from '$lib/user.types';
const PASSWORD_RESET_FORM_SCHEMA = USER_REGISTER_FORM_SCHEMA.pick({
  email: true,
});

export const load = (async () => {
  const form = await superValidate(zod(PASSWORD_RESET_FORM_SCHEMA));

  return {
    seo: {
      title: 'Password reset',
      description: 'Reset your password to access your account',
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  reset: async ({ locals, request }) => {
    const form = await superValidate(request, zod(PASSWORD_RESET_FORM_SCHEMA));

    if (!form.valid) {
      return fail(400, { form });
    }

    await locals.pb.collection('users').requestPasswordReset(form.data.email);
    redirect(303, 'login');
  },
} satisfies Actions;
