import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BlueprintRecordData } from '$lib/blueprint';
import { BLUEPRINT_FORM_SCHEMA } from '$lib/blueprint.schema';
import { put } from '$lib/server/blueprint.api';

export const PUT: RequestHandler = async ({ locals, params, request }) => {
  if (!locals.user) {
    return error(401);
  }

  const { id } = params;
  const form = await superValidate(request, zod(BLUEPRINT_FORM_SCHEMA));
  if (!form.valid) {
    return json(form.errors, { status: 400 });
  }

  try {
    const record = await put(locals.pb, id, form.data);
    return json(record, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return json((error.cause as SuperValidated<BlueprintRecordData>).errors, {
      status: 400,
    });
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  if (!locals.user) {
    return error(401);
  }

  const { id } = params;
  if (!locals.user.blueprints.includes(id)) {
    return error(404);
  }

  try {
    const success = await locals.pb.collection('blueprints').delete(id);
    return json(success ? id : undefined);
  } catch (err) {
    const error = err as Error;
    return json(error, { status: 500 });
  }
};
