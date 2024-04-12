import type { ListResult } from 'pocketbase';
import type { PageServerLoad } from './$types';
import type { BlueprintRecord } from '$lib/blueprint.types';

export const load = (async ({ fetch, locals, url }) => {
    const searchUrl = new URL('/api/v1/blueprint/search', url.origin);
    searchUrl.search = url.search;
    const response = await fetch(searchUrl.href);
    const result = await response.json() as ListResult<BlueprintRecord>;
    const images = result.items.reduce<Record<string, string>>((result, current) => {
        if (current.images.length <= 0) return result;
        result[current.id] = locals.pb.files.getUrl(current, current.images[0], { thumb: '600x400' });
        return result;
    }, {});
    const search = url.searchParams.get('title');
    return {
        seo: {
            title: `Blueprint Search${search ? ` - “${search}”` : ''}`,
            description: search ? `List of blueprints for “${search}”.` : 'Search all blueprints.'
        },
        search,
        result,
        images,
    };
}) satisfies PageServerLoad;
