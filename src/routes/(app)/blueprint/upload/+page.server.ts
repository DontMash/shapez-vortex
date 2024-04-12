import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BLUEPRINT_CREATE_SCHEMA, type BlueprintTag } from '$lib/blueprint.types';
import { decode, getBuildingCount, getBuildings, getCost, getIslandCount } from '$lib/server/blueprint';
import type { User } from '$lib/user.types';

export const load = (async ({ locals }) => {
    if (locals.user && !locals.user.verified) {
        redirect(303, '/settings/account');
    }

    return {
        seo: {
            title: 'Upload Blueprint',
            description: 'Share your blueprint with the community.',
            keywords: ['Blueprint', 'Upload'],
        },
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
        const result = BLUEPRINT_CREATE_SCHEMA.safeParse(entries);
        if (!result.success) {
            const issues = result.error.issues.reduce<Record<string, string>>((result, current) => {
                result[current.path[0]] = current.message;
                return result;
            }, {});
            return fail(400, { data: { ...entries, images: undefined }, issues, invalid: true });
        }

        let tags: Array<BlueprintTag> = [];
        if (result.data.tags) {
            const promises = Array.from(result.data.tags).map(tag => new Promise<BlueprintTag>((resolve, reject) => {
                locals.pb.collection('tags').create<BlueprintTag>({ name: tag, creator: locals.user?.id }, { requestKey: null })
                    .then(resolve)
                    .catch(() =>
                        locals.pb.collection('tags').getFirstListItem<BlueprintTag>(`name="${tag}"`, { requestKey: null })
                            .then(resolve)
                            .catch(reject)
                    );
            }));
            tags = await Promise.all(promises);
        }

        const blueprint = decode(result.data.data);
        const buildings = getBuildings(blueprint);
        const buildingCount = getBuildingCount(blueprint);

        const blueprintFormData = new FormData();
        blueprintFormData.append('title', result.data.title);
        blueprintFormData.append('data', result.data.data);
        blueprintFormData.append('description', result.data.description ?? '');
        result.data.images?.forEach(image => blueprintFormData.append('images', image));
        tags.forEach(tag => blueprintFormData.append('tags', tag.id));
        blueprintFormData.append('type', blueprint.BP.$type);
        blueprintFormData.append('cost', getCost(buildingCount).toString());
        blueprintFormData.append('buildings', JSON.stringify(Object.fromEntries(buildings)));
        blueprintFormData.append('buildingCount', buildingCount.toString());
        blueprintFormData.append('islandCount', getIslandCount(blueprint).toString());
        blueprintFormData.append('creator', locals.user?.id);
        blueprintFormData.append('viewCount', String(1));
        blueprintFormData.append('downloadCount', String(1));
        blueprintFormData.append('bookmarkCount', String(1));
        blueprintFormData.append('version', String(1));

        const record = await locals.pb.collection('blueprints').create(blueprintFormData);
        await locals.pb.collection('users').update<User>(locals.user.id, {
            'blueprints+': record.id
        });
        redirect(303, `/blueprint/${record.id}`);
    }
} satisfies Actions;
