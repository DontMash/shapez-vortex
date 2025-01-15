import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    seo: {
      title: 'Password reset',
      description: 'Reset your password to access your account',
    },
  };
}) satisfies PageServerLoad;

export const actions = {
  reset: async ({ locals, request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    const schema = z.object({ email: z.string().email() });
    const result = schema.safeParse(entries);
    if (!result.success) {
      return fail(400, {
        data: entries,
        issues: result.error.issues,
        invalid: true,
      });
    }
    await locals.pb.collection('users').requestPasswordReset(result.data.email);
    redirect(303, 'login');
  },
} satisfies Actions;
