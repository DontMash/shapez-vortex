import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { BlueprintTag } from '$lib/blueprint.types';
import {
  PAGINATION_SCHEMA,
  SEARCH_SCHEMA,
  type SearchOrderOption,
  type SearchSortOption,
} from '$lib/search.schema';
import { get, getBlueprintOptions } from '$lib/server/blueprint.api';

export const load = (async ({ locals, url }) => {
  const options = getBlueprintOptions(url);
  const result = await get(locals.pb, options);
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

  const query = url.searchParams.get('query') ?? undefined;
  const filter = url.searchParams.get('filter') ?? undefined;
  const sort = (url.searchParams.get('sort') ?? 'created') as SearchSortOption;
  const order = (url.searchParams.get('order') ?? 'desc') as SearchOrderOption;

  const form = await superValidate(
    {
      query,
      filter,
      sort,
      order,
      page: options.page,
      perPage: options.perPage,
    },
    zod(z.intersection(SEARCH_SCHEMA, PAGINATION_SCHEMA)),
  );

  return {
    seo: {
      title: 'Browse blueprints',
      description:
        'Search the whole collection of blueprints. Filter & sort to find the blueprint that suits your requirements.',
    },
    result,
    images,
    tags,
    form,
  };
}) satisfies PageServerLoad;
