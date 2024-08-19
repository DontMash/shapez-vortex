import type { ListResult } from 'pocketbase';
import type { BlueprintRecord } from '$lib/blueprint.types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const searchUrl = new URL('/api/v1/blueprint', url.origin);
	searchUrl.searchParams.set('perPage', String(3));
	const response = await fetch(searchUrl);
	if (response.ok) {
		const result = (await response.json()) as ListResult<BlueprintRecord>;
		const images = result.items?.reduce<Record<string, string>>((result, current) => {
			if (current.images.length <= 0) return result;
			result[current.id] = locals.pb.files.getUrl(current, current.images[0], { thumb: '600x400' });
			return result;
		}, {});

		return {
			latestBlueprints: result.items,
			latestBlueprintImages: images
		};
	}

	return {};
}) satisfies PageServerLoad;
