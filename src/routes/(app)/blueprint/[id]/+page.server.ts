import PocketBase from 'pocketbase';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_EMAIL, ADMIN_PASSWORD, POCKETBASE_URL } from '$env/static/private';
import type { BlueprintData } from '$lib/blueprint.types';
import { decode } from '$lib/server/blueprint';
import type { User } from '$lib/user.types';

export const load = (async ({ depends, locals, params }) => {
    try {
        const blueprint = await locals.pb.collection('blueprints').getOne<BlueprintData>(params.id, { expand: 'tags,creator' });
        const images = blueprint.images.map(image =>
        ({
            thumbnail: locals.pb.files.getUrl(blueprint, image, { thumb: '600x400' }),
            src: locals.pb.files.getUrl(blueprint, image)
        }));
        const data = decode(blueprint.data);

        let isBookmarked = false;
        if (locals.user) {
            const user = await locals.pb.collection('users').getOne<User>(locals.user?.id);
            isBookmarked = user.blueprints.includes(blueprint.id);
        }

        depends('update:blueprint');
        return {
            seo: {
                title: `Blueprint - ${blueprint.title}`,
                description: blueprint.description,
            },
            blueprint: {
                entry: blueprint,
                images,
                data,
                isBookmarked,
            }
        };
    } catch (err) {
        error(404, 'Blueprint not found');
    }
}) satisfies PageServerLoad;

export const actions = {
    updateBookmark: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401);
        }

        const isBookmarked = locals.user.blueprints.includes(params.id);
        const pb = new PocketBase(POCKETBASE_URL);
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        if (isBookmarked) {
            await locals.pb.collection('users').update(locals.user.id, { 'blueprints-': params.id });
            await pb.collection('blueprints').update(
                params.id, { 'bookmarkCount-': 1 });
        } else {
            await locals.pb.collection('users').update(locals.user.id, { 'blueprints+': params.id });
            await pb.collection('blueprints').update(params.id, { 'bookmarkCount+': 1 });
        }

        return { success: true };
    },
    deleteBlueprint: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401);
        }
        if (!locals.user.blueprints.includes(params.id)) {
            return fail(404);
        }

        await locals.pb.collection('blueprints').delete(params.id);

        return { success: true };
    },
} satisfies Actions;
