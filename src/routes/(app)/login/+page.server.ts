import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { USER_LOGIN_FORM_SCHEMA } from '$lib/user.types';

export const load = (async ({ locals }) => {
  if (locals.user) {
    redirect(303, 'user');
  }

  const form = await superValidate(zod(USER_LOGIN_FORM_SCHEMA));

  return {
    seo: {
      title: 'Login',
      description:
        'Login to access more features and share content for the shapez community',
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ locals, request }) => {
    const form = await superValidate(request, zod(USER_LOGIN_FORM_SCHEMA));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await locals.pb
        .collection('users')
        .authWithPassword(form.data.username, form.data.password);

      redirect(303, form.data.redirect ?? 'user');
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
    }
  },
} satisfies Actions;
