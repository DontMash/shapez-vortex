import { error, json } from '@sveltejs/kit';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	get,
	getBlueprintOptions,
	post
} from '$lib/server/blueprint.api';
import { BLUEPRINT_FORM_SCHEMA } from '$lib/blueprint.schema';
import type { BlueprintRecordData } from '$lib/blueprint.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const result = await get(locals.pb, getBlueprintOptions(url));
	return json(result);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user || !locals.user.verified) {
		return error(401);
	}

	const form = await superValidate(request, zod(BLUEPRINT_FORM_SCHEMA));
	if (!form.valid) {
		return json(form.errors, { status: 400 });
	}

	try {
		const record = await post(locals.pb, form.data);
		return json(record, { status: 201 });
	} catch (err) {
		const error = err as Error;
		return json((error.cause as SuperValidated<BlueprintRecordData>).errors, { status: 400 });
	}
};
