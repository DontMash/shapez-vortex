import type { BlueprintTag } from '$lib/blueprint.types';
import { get, getBlueprintOptions } from '$lib/server/blueprint.api';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
  const result = await get(locals.pb, getBlueprintOptions(url));
  const images = result.items?.reduce<Record<string, string>>(
    (result, current) => {
      if (current.images.length <= 0) return result;
      result[current.id] = locals.pb.files.getUrl(current, current.images[0], {
        thumb: '600x400',
      });
      return result;
    },
    {},
  );

  const tags = await locals.pb.collection<BlueprintTag>('tags').getFullList();
  const query = url.searchParams.get('query');
  const filter = url.searchParams.get('filter');
  const sort = url.searchParams.get('sort');
  const order = url.searchParams.get('order');

  return {
    seo: {
      title: `Browse blueprints`,
      description: query
        ? `List of blueprints for “${query}”.`
        : 'List of all blueprints.',
    },
    result,
    images,
    tags,
    query,
    filter,
    sort,
    order,
  };
}) satisfies PageServerLoad;
