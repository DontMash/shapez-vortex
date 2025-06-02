import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { USER_LOGIN_FORM_SCHEMA } from '$lib/user';

export const POST: RequestHandler = async ({ locals, request }) => {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData);
  const result = USER_LOGIN_FORM_SCHEMA.safeParse(entries);
  if (!result.success) {
    return json(result.error, {
      status: 400,
    });
  }

  try {
    const user = await locals.pb
      .collection('users')
      .authWithPassword(result.data.username, result.data.password);
    return json(user);
  } catch (err) {
    return json(err, { status: 400 });
  }
};
