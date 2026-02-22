import type { PageServerLoad } from './$types';
import { get } from '$lib/server/blueprint.api';

export const load = (async ({ locals }) => {
  try {
    const result = await get(locals.pb, { query: '', perPage: 3 });
    const latestBlueprints = result.items;

    const images = latestBlueprints.reduce<Record<string, string>>(
      (result, current) => {
        if (current.images.length <= 0) return result;
        result[current.id] = locals.pb.files.getURL(
          current,
          current.images[0],
          {
            thumb: '600x400',
          },
        );
        return result;
      },
      {},
    );

    return {
      latestBlueprints,
      latestBlueprintImages: images,
    };
  } catch {
    return {};
  }
}) satisfies PageServerLoad;
