import type { ClientResponseError } from 'pocketbase';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  USER_REGISTER_FORM_SCHEMA,
  USER_FORM_ERROR_MESSAGES,
} from '$lib/user.types';

export const load = (({ locals }) => {
  if (locals.user) {
    redirect(303, 'user');
  }
  return {
    seo: {
      title: 'Register',
      description:
        'Register yourself to access more features and share content for the shapez community',
    },
  };
}) satisfies PageServerLoad;

export const actions = {
  register: async ({ locals, request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    const result = USER_REGISTER_FORM_SCHEMA.safeParse(entries);
    if (!result.success) {
      return fail(400, {
        data: entries,
        issues: result.error.issues,
        invalid: true,
      });
    }
    try {
      await locals.pb.collection('users').create({
        ...result.data,
        passwordConfirm: result.data.password,
      });
      await locals.pb
        .collection('users')
        .requestVerification(result.data.email);

      redirect(303, 'login');
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      const error = err as ClientResponseError;
      const issues = Object.keys(error.response.data).map((key) => ({
        message: USER_FORM_ERROR_MESSAGES[key],
      }));
      return fail(500, { data: entries, issues, error: true });
    }
  },
} satisfies Actions;
