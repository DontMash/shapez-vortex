import { error, json } from '@sveltejs/kit';
import { ZodIssueCode, type ZodError } from 'zod';
import { decode, getBuildingCount, getBuildings, getCost, getIslandCount } from '$lib/blueprint';
import {
	BLUEPRINT_CREATE_SCHEMA,
	BLUEPRINT_UPDATE_SCHEMA,
	isLike,
	type BlueprintRecord,
	type BlueprintTag
} from '$lib/blueprint.types';
import type { User } from '$lib/user.types';
import type { RequestHandler } from './$types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_ENTRIES = 10;

export const GET: RequestHandler = async ({ locals, url }) => {
	const sort = ['id'];
	const sortParams = url.searchParams.get('sort');
	const orderParams = url.searchParams.get('order');
	sort.unshift(sortParams ? `${orderParams === 'desc' ? '-' : ''}${sortParams}` : '-created');
	const query = url.searchParams.get('query');
	const filter = [`title~"${query ?? ''}"`];
	const filterParams = url.searchParams.get('filter');
	if (filterParams) {
		const options = filterParams.split(';');
		for (const option of options) {
			const [key, value] = option.split('=');
			switch (key) {
				case 'tags':
					const tagFilterList = value.split(',');
					const tagCollectionFilter = tagFilterList.map((tag) => `name="${tag}"`).join('||');
					const tags = await locals.pb
						.collection('tags')
						.getFullList({ filter: tagCollectionFilter });
					if (tags.length <= 0) break;

					const tagFilter = tags.map((tag) => `${key}?~"${tag.id}"`).join('||');
					filter.push(tagFilter);
					break;
			}
		}
	}

	const page = Number(url.searchParams.get('page')) || DEFAULT_PAGE;
	const maxPage = Number(url.searchParams.get('perPage')) || DEFAULT_PAGE_ENTRIES;
	const expand: Array<string> = ['tags', 'creator'];
	const fields = [
		'collectionId',
		'id',
		'title',
		'images',
		'creator',
		'expand.tags.id',
		'expand.tags.name',
		'expand.creator.displayname'
	];
	const blueprints = await locals.pb.collection('blueprints').getList(page, maxPage, {
		expand: expand.join(','),
		fields: fields.join(','),
		sort: sort.join(','),
		filter: filter.join('&&')
	});

	return json(blueprints);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user || !locals.user.verified) {
		return error(401);
	}

	const formData = await request.formData();
	const entries = { ...Object.fromEntries(formData), images: formData.getAll('images') };
	const result = BLUEPRINT_CREATE_SCHEMA.safeParse(entries);
	if (!result.success) {
		return json(result.error, { status: 400 });
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

	const {
		title,
		data,
		description,
		images,
		blueprint,
		cost,
		buildings,
		buildingCount,
		islandCount
	} = result.data;
	const blueprintFormData = new FormData();
	blueprintFormData.append('title', title);
	blueprintFormData.append('data', data);
	blueprintFormData.append('description', description ?? '');
	images?.forEach((image) => blueprintFormData.append('images', image));
	tags.forEach((tag) => blueprintFormData.append('tags', tag.id));
	blueprintFormData.append('type', blueprint.BP.$type);
	blueprintFormData.append('cost', cost.toString());
	blueprintFormData.append('buildings', JSON.stringify(Object.fromEntries(buildings)));
	blueprintFormData.append('buildingCount', buildingCount.toString());
	blueprintFormData.append('islandCount', islandCount.toString());
	blueprintFormData.append('creator', locals.user?.id);
	blueprintFormData.append('viewCount', String(1));
	blueprintFormData.append('downloadCount', String(1));
	blueprintFormData.append('bookmarkCount', String(1));
	blueprintFormData.append('version', String(1));

	const record = await locals.pb.collection('blueprints').create(blueprintFormData);
	await locals.pb.collection('users').update<User>(locals.user.id, {
		'blueprints+': record.id
	});
	return json(record, { status: 201 });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return error(401);
	}

	const formData = await request.formData();
	const entries = { ...Object.fromEntries(formData), images: formData.getAll('images') };
	const result = BLUEPRINT_UPDATE_SCHEMA.safeParse(entries);
	if (!result.success) {
		return json(result.error, { status: 400 });
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
		(Object.values(entries).length <= 2 && entries.images.length <= 0) ||
		isLike(
			{
				...result.data,
				tags: tags.map<string>((tag) => tag.id),
				images: result.data.images?.map<string>((image) => image.name)
			},
			blueprintRecord
		)
	) {
		const error: Pick<ZodError, 'issues'> = {
			issues: [
				{
					code: ZodIssueCode.custom,
					path: [],
					message: 'unmodified blueprint'
				}
			]
		};
		return json(error, { status: 400 });
	}

	const blueprintFormData = new FormData();
	if (result.data.data) {
		const blueprint = decode(result.data.data);
		const buildings = getBuildings(blueprint);
		if (buildings.size <= 0) {
			const error: Pick<ZodError, 'issues'> = {
				issues: [
					{
						code: ZodIssueCode.custom,
						path: [],
						message: 'Minimum of one building entry required'
					}
				]
			};
			return json(error, { status: 400 });
		}
		const buildingCount = getBuildingCount(blueprint);
		if (buildings.size <= 0) {
			const error: Pick<ZodError, 'issues'> = {
				issues: [
					{
						code: ZodIssueCode.custom,
						path: [],
						message: 'Minimum of one building required'
					}
				]
			};
			return json(error, { status: 400 });
		}
		const islandCount = getIslandCount(blueprint);
		const blueprintCost = getCost(buildingCount);

		blueprintFormData.append('data', result.data.data);
		blueprintFormData.append('type', blueprint.BP.$type);
		blueprintFormData.append('cost', blueprintCost.toString());
		blueprintFormData.append('buildings', JSON.stringify(Object.fromEntries(buildings)));
		blueprintFormData.append('buildingCount', buildingCount.toString());
		blueprintFormData.append('islandCount', islandCount.toString());
	}
	if (result.data.title) {
		blueprintFormData.append('title', result.data.title);
	}
	if (result.data.description) {
		blueprintFormData.append('description', result.data.description);
	}
	blueprintFormData.append('viewCount', String(blueprintRecord.viewCount));
	blueprintFormData.append('downloadCount', String(blueprintRecord.downloadCount));
	blueprintFormData.append('bookmarkCount', String(blueprintRecord.bookmarkCount));
	blueprintFormData.append('version', String(blueprintRecord.version + 1));
	result.data.images?.forEach((image) => blueprintFormData.append('images', image));
	tags.forEach((tag) => blueprintFormData.append('tags', tag.id));

	await locals.pb.collection('blueprints').update(result.data.id, { images: null });
	const record = await locals.pb.collection('blueprints').update(result.data.id, blueprintFormData);
	return json(record, { status: 200 });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return error(401);
	}
	const formData = await request.formData();
	const id = String(formData.get('id'));
	if (!id) {
		return error(400);
	}
	if (!locals.user.blueprints.includes(id)) {
		return error(404);
	}

	await locals.pb.collection('blueprints').delete(id);
	return json({});
};
