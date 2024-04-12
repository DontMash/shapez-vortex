import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	BLUEPRINT_UPDATE_SCHEMA,
	isLike,
	type BlueprintRecord,
	type BlueprintTag
} from '$lib/blueprint.types';
import {
	decode,
	getBuildingCount,
	getBuildings,
	getCost,
	getIslandCount
} from '$lib/server/blueprint';

export const load = (async ({ locals, parent, url }) => {
	if (!locals.user) {
		const loginUrl = new URL('login', url.origin);
		loginUrl.searchParams.set('redirect', url.pathname);
		redirect(303, loginUrl.href);
	}
	const data = await parent();
	if (locals.user.id !== data.blueprint.entry.creator) {
		redirect(303, `/blueprint/${data.blueprint.entry.id}`);
	}
	if (!locals.user.verified) {
		redirect(303, '/settings/account');
	}

	return {
		seo: {
			title: `Edit blueprint - ${data.blueprint.entry.title}`,
			description: 'Update your blueprint with new or more information.'
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals, request }) => {
		if (locals.user && !locals.user.verified) {
			redirect(303, '/settings/account');
		}
		if (!locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const entries = { ...Object.fromEntries(formData), images: formData.getAll('images') };
		const result = BLUEPRINT_UPDATE_SCHEMA.safeParse(entries);
		if (!result.success) {
			const issues = result.error.issues.reduce<Record<string, string>>((result, current) => {
				result[current.path[0]] = current.message;
				return result;
			}, {});
			return fail(400, { data: { ...entries, images: undefined }, issues, invalid: true });
		}

		let tags: Array<BlueprintTag> = [];
		if (result.data.tags) {
			const promises = Array.from(result.data.tags).map(
				(tag) =>
					new Promise<BlueprintTag>((resolve, reject) => {
						locals.pb
							.collection('tags')
							.create<BlueprintTag>({ name: tag, creator: locals.user?.id }, { requestKey: null })
							.then(resolve)
							.catch(() =>
								locals.pb
									.collection('tags')
									.getFirstListItem<BlueprintTag>(`name="${tag}"`, { requestKey: null })
									.then(resolve)
									.catch(reject)
							);
					})
			);
			tags = await Promise.all(promises);
		}
		const blueprintRecord = await locals.pb
			.collection<BlueprintRecord>('blueprints')
			.getOne(result.data.id);
		if (
			isLike(
				{
					...result.data,
					tags: tags.map<string>((tag) => tag.id),
					images: result.data.images?.map<string>((image) => image.name)
				},
				blueprintRecord
			)
		)
			return fail(400, {
				data: { ...entries, images: undefined },
				issues: { unmodified: 'Unmodified blueprint' },
				invalid: true
			});

		const blueprint = decode(result.data.data);
		const buildings = getBuildings(blueprint);
		const buildingCount = getBuildingCount(blueprint);

		const blueprintFormData = new FormData();
		blueprintFormData.append('title', result.data.title);
		blueprintFormData.append('data', result.data.data);
		blueprintFormData.append('type', blueprint.BP.$type);
		blueprintFormData.append('cost', getCost(buildingCount).toString());
		blueprintFormData.append('buildings', JSON.stringify(Object.fromEntries(buildings)));
		blueprintFormData.append('buildingCount', buildingCount.toString());
		blueprintFormData.append('islandCount', getIslandCount(blueprint).toString());
		blueprintFormData.append('description', result.data.description ?? '');
		result.data.images?.forEach((image) => blueprintFormData.append('images', image));
		tags.forEach((tag) => blueprintFormData.append('tags', tag.id));
		blueprintFormData.append('version', String(blueprintRecord.version + 1));

		await locals.pb.collection('blueprints').update(result.data.id, { images: null });
		const record = await locals.pb
			.collection('blueprints')
			.update(result.data.id, blueprintFormData);
		redirect(303, `/blueprint/${record.id}`);
	}
} satisfies Actions;
