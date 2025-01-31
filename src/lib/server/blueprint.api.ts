import type PocketBase from 'pocketbase';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  decode,
  getBuildingCount,
  getBuildings,
  getCost,
  getIslandCount,
} from '$lib/blueprint';
import {
  BLUEPRINT_CREATE_SCHEMA,
  BLUEPRINT_TAGS_MAX,
  type BlueprintFormData,
} from '$lib/blueprint.schema';
import type { BlueprintRecord, BlueprintTag } from '$lib/blueprint.types';
import type { User } from '$lib/user.types';

type BlueprintGetOptions = {
  query: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, Array<string>>;
  page?: number;
  perPage?: number;
};

const GET_EXPAND_FIELDS = ['tags', 'creator'];
const GET_FIELDS = [
  'collectionId',
  'id',
  'title',
  'images',
  'creator',
  'expand.tags.id',
  'expand.tags.name',
  'expand.creator.displayname',
];
const DEFAULT_GET_PAGE = 1;
const DEFAULT_GET_PAGE_ENTRIES = 10;
const DEFAULT_GET_OPTIONS: BlueprintGetOptions = {
  query: '',
  sort: 'created',
  order: 'desc',
  page: DEFAULT_GET_PAGE,
  perPage: DEFAULT_GET_PAGE_ENTRIES,
};

export const get = async (pb: PocketBase, options?: BlueprintGetOptions) => {
  const { query, sort, order, filter, page, perPage } = {
    ...DEFAULT_GET_OPTIONS,
    ...options,
  };
  const sortParams = [`${order === 'desc' ? '-' : ''}${sort}`, 'id'];
  const filterParams = [`title~"${query ?? ''}"`];
  if (filter) {
    const filterEntries = Object.entries(filter);
    for (const [key, value] of filterEntries) {
      switch (key) {
        case 'tags': {
          const tagCollectionFilter = value
            .map((tag) => `name="${tag}"`)
            .join('||');
          const tags = await pb
            .collection('tags')
            .getFullList({ filter: tagCollectionFilter });
          if (tags.length <= 0) break;

          const tagFilter = tags.map((tag) => `${key}?~"${tag.id}"`).join('||');
          filterParams.push(tagFilter);
        }
      }
    }
  }

  const blueprints = await pb
    .collection<BlueprintRecord>('blueprints')
    .getList(page, perPage, {
      expand: GET_EXPAND_FIELDS.join(','),
      fields: GET_FIELDS.join(','),
      sort: sortParams.join(','),
      filter: filterParams.join('&&'),
      requestKey: null,
    });
  return blueprints;
};

export const post = async (
  pb: PocketBase,
  value: BlueprintFormData,
): Promise<BlueprintRecord> => {
  const tags = value.tags ? await createBlueprintTags(pb, value.tags) : [];
  const formData = getBlueprintFormData(pb, value, tags);

  const form = await superValidate(formData, zod(BLUEPRINT_CREATE_SCHEMA));
  if (!form.valid) {
    throw new Error('Invalid blueprint record', { cause: form.errors });
  }

  const record = await pb
    .collection<BlueprintRecord>('blueprints')
    .create(formData);
  const user = pb.authStore.model;
  await pb.collection('users').update<User>(user?.id, {
    'blueprints+': record.id,
  });
  return record;
};

export const put = async (
  pb: PocketBase,
  id: string,
  value: BlueprintFormData,
): Promise<BlueprintRecord> => {
  const tags = value.tags ? await createBlueprintTags(pb, value.tags) : [];

  const formData = getBlueprintFormData(pb, value, tags);
  const form = await superValidate(formData, zod(BLUEPRINT_CREATE_SCHEMA));
  if (!form.valid) {
    throw new Error('Invalid blueprint record', { cause: form.errors });
  }

  const blueprintRecord = await pb
    .collection<BlueprintRecord>('blueprints')
    .getOne(id);
  formData.set('viewCount', String(blueprintRecord.viewCount));
  formData.set('downloadCount', String(blueprintRecord.downloadCount));
  formData.set('bookmarkCount', String(blueprintRecord.bookmarkCount));
  formData.set('version', String(blueprintRecord.version + 1));

  await pb
    .collection<BlueprintRecord>('blueprints')
    .update(id, { images: null });
  const record = await pb
    .collection<BlueprintRecord>('blueprints')
    .update(id, formData);
  return record;
};

const createBlueprintTags = async (pb: PocketBase, value: string) =>
  new Promise<Array<BlueprintTag>>((resolve) => {
    const user = pb.authStore.model;
    const tags = new Set(
      value
        .replace(/\s+/gi, '')
        .toLocaleLowerCase()
        .split(',')
        .filter((tag) => tag.length !== 0)
        .slice(0, BLUEPRINT_TAGS_MAX),
    );
    const promises = [...tags].map(
      (tag) =>
        new Promise<BlueprintTag>((resolve, reject) => {
          pb.collection('tags')
            .create<BlueprintTag>(
              { name: tag, creator: user?.id },
              { requestKey: null },
            )
            .then(resolve)
            .catch(() =>
              pb
                .collection('tags')
                .getFirstListItem<BlueprintTag>(`name="${tag}"`, {
                  requestKey: null,
                })
                .then(resolve)
                .catch(reject),
            );
        }),
    );
    resolve(Promise.all(promises));
  });

const getBlueprintFormData = (
  pb: PocketBase,
  value: BlueprintFormData,
  tags: Array<BlueprintTag>,
): FormData => {
  const { title, data, description, images } = value;

  const blueprint = decode(data);
  const buildings = getBuildings(blueprint);
  const buildingCount = getBuildingCount(blueprint);
  const islandCount = getIslandCount(blueprint);
  const cost = getCost(buildingCount);

  const formData = new FormData();
  formData.append('title', title);
  formData.append('data', data);
  formData.append('description', description ?? '');
  images?.forEach((image) => formData.append('images', image));
  tags.forEach((tag) => formData.append('tags', tag.id));
  formData.append('type', blueprint.BP.$type);
  formData.append('cost', cost.toString());
  formData.append('buildings', JSON.stringify(Object.fromEntries(buildings)));
  formData.append('buildingCount', buildingCount.toString());
  formData.append('islandCount', islandCount.toString());
  formData.append('creator', pb.authStore.model?.id ?? '');
  formData.append('viewCount', String(1));
  formData.append('downloadCount', String(1));
  formData.append('bookmarkCount', String(1));
  formData.append('version', String(1));

  return formData;
};

export const getBlueprintOptions = (url: URL) => {
  const filterParams = String(url.searchParams.get('filter'));
  const filterEntries = filterParams.split(';');
  const filter = filterEntries.reduce<Record<string, Array<string>>>(
    (result, current) => {
      const [key, valueString] = current.split('=');
      const value = valueString?.split(',');
      result[key] = value;
      return result;
    },
    {},
  );
  const options: BlueprintGetOptions = {
    query: url.searchParams.get('query') ?? '',
    filter,
    page: Number(url.searchParams.get('page')),
    perPage: Number(url.searchParams.get('perPage')),
  };
  const sort = url.searchParams.get('sort');
  if (sort) {
    options.sort = sort;
  }
  const order = url.searchParams.get('order');
  if (order) {
    options.order = order as 'asc' | 'desc';
  }
  return options;
};
