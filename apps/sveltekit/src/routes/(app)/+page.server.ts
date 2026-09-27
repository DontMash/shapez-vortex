import type { PageServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
  const data = await parent();
  try {
    const images = data.searchBlueprints
      .slice(0, 3)
      .reduce<Record<string, string>>((result, current) => {
        if (current.images.length <= 0) return result;
        result[current.id] = locals.pb.files.getURL(
          current,
          current.images[0],
          {
            thumb: '600x400',
          },
        );
        return result;
      }, {});

    return {
      blueprintImages: images,
    };
  } catch {
    return {};
  }
}) satisfies PageServerLoad;
