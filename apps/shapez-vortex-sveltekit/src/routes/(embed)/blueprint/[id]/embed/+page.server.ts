import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { decode, type BlueprintRecord } from '$lib/blueprint';

export const load = (async ({ locals, params }) => {
  try {
    const blueprint = await locals.pb
      .collection('blueprints')
      .getOne<BlueprintRecord>(params.id);

    const data = decode(blueprint.data);

    return {
      seo: {
        title: `Blueprint Embed - ${blueprint.title}`,
        description: blueprint.description,
      },
      blueprint: {
        entry: blueprint,
        data,
      },
    };
  } catch {
    error(404, 'Blueprint not found');
  }
}) satisfies PageServerLoad;
