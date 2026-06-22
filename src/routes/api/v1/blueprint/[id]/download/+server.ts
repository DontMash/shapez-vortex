import type { RequestHandler } from './$types';
import {
  BLUEPRINT_FILE_FORMAT,
  type BlueprintRecord,
} from '$lib/blueprint.types';

export const GET: RequestHandler = async ({ locals, params }) => {
  const blueprint = await locals.pb
    .collection('blueprints')
    .getOne<BlueprintRecord>(params.id);

  if (locals.user && locals.user.id !== blueprint.creator) {
    await locals.pb
      .collection('blueprints')
      .update(params.id, { 'downloadCount+': 1 });
  }

  const codec = new TextEncoder();
  const data = codec.encode(blueprint.data);
  const name = blueprint.title.replace(/\s+/gi, '_');

  return new Response(data, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name}${BLUEPRINT_FILE_FORMAT}"`,
    },
  });
};
