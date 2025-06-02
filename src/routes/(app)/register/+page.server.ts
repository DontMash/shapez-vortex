import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { USER_REGISTER_FORM_SCHEMA } from '$lib/user';
import { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals }) => {
  if (locals.user) {
    redirect(303, 'user');
  }

  const form = await superValidate(zod(USER_REGISTER_FORM_SCHEMA));

  return {
    seo: {
      title: 'Register',
      description:
        'Register yourself to access more features and share content for the shapez community',
    },
    form,
  };
}) satisfies PageServerLoad;

export const actions = {
  register: async ({ locals, request }) => {
    const form = await superValidate(request, zod(USER_REGISTER_FORM_SCHEMA));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      await locals.pb.collection('users').create({
        ...form.data,
        passwordConfirm: form.data.password,
      });
      await locals.pb.collection('users').requestVerification(form.data.email);

      redirect(303, 'login');
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      if (err instanceof ClientResponseError) {
        if (err.data.data.username) {
          return setError(form, 'username', err.message);
        }
        if (err.data.data.email) {
          return setError(form, 'email', err.message);
        }
      }
    }
  },
} satisfies Actions;
