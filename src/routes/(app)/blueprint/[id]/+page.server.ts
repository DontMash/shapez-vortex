import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import type { BlueprintRecord } from '$lib/blueprint.types';
import { REPORT_CREATE_SCHEMA } from '$lib/report.types';

export const load = (async () => {
  const form = await superValidate(zod(REPORT_CREATE_SCHEMA));

  return { form };
}) satisfies PageServerLoad;

export const actions = {
  bookmark: async ({ locals, params }) => {
    if (!locals.user) {
      return error(401);
    }

    const isBookmarked = locals.user.bookmarks.includes(params.id);
    if (isBookmarked) {
      await locals.pb
        .collection('users')
        .update(locals.user.id, { 'bookmarks-': params.id });
      await locals.pb
        .collection('blueprints')
        .update(params.id, { 'bookmarkCount-': 1 });
    } else {
      await locals.pb
        .collection('users')
        .update(locals.user.id, { 'bookmarks+': params.id });
      await locals.pb
        .collection('blueprints')
        .update(params.id, { 'bookmarkCount+': 1 });
    }

    const form = await superValidate(zod(REPORT_CREATE_SCHEMA));
    return { form };
  },
  delete: async ({ locals, params, request }) => {
    if (!locals.user) {
      return error(401);
    }
    const { id } = params;
    if (!locals.user.blueprints.includes(id)) {
      return error(404);
    }

    await locals.pb.collection('blueprints').delete(id);

    const referrer = request.headers.get('referer') ?? '';
    if (referrer.includes(id)) {
      return redirect(303, '/blueprint/search');
    } else {
      return id;
    }
  },
  report: async ({ locals, request }) => {
    if (!locals.user) {
      return error(401);
    }
    if (!locals.user.verified) {
      return error(403);
    }

    const form = await superValidate(request, zod(REPORT_CREATE_SCHEMA), {
      id: 'report-blueprint',
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const blueprint = await locals.pb
      .collection<BlueprintRecord>('blueprints')
      .getOne(form.data.blueprint);
    if (locals.user.id === blueprint.creator) {
      return error(403);
    }

    await locals.pb
      .collection('blueprintReports')
      .create({ ...form.data, user: locals.user.id });
    return message(form, 'Blueprint reported.');
  },
} satisfies Actions;
