import type { ListResult } from 'pocketbase';
import type { PageServerLoad } from './$types';
import type { BlueprintRecord, BlueprintTag } from '$lib/blueprint.types';

export const load = (async ({ fetch, locals, url }) => {
    const searchUrl = new URL('/api/v1/blueprint/search', url.origin);
    searchUrl.search = url.search;
    const response = await fetch(searchUrl.href);

    const result = await response.json() as ListResult<BlueprintRecord>;
    const images = result.items?.reduce<Record<string, string>>((result, current) => {
        if (current.images.length <= 0) return result;
        result[current.id] = locals.pb.files.getUrl(current, current.images[0], { thumb: '600x400' });
        return result;
    }, {});
    const tags = await locals.pb.collection<BlueprintTag>('tags').getFullList();

    const query = url.searchParams.get('query');
    const filter = url.searchParams.get('filter');
    const sort = url.searchParams.get('sort');
    const order = url.searchParams.get('order');    

    return {
        seo: {
            title: `Browse blueprints`,
            description: query ? `List of blueprints for “${query}”.` : 'Browse all blueprints.'
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
