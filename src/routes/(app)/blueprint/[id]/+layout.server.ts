import PocketBase from 'pocketbase';
import { error } from '@sveltejs/kit';
import { POCKETBASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import type { BlueprintData } from '$lib/blueprint.types';
import type { User } from '$lib/user.types';
import { decode } from '$lib/server/blueprint';
import type { LayoutServerLoad } from './$types';

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
        if (locals.user && locals.user.verified && locals.user.id !== blueprint.creator) {
            const pb = new PocketBase(POCKETBASE_URL);
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
            await pb.collection('blueprints').update(blueprint.id, { 'viewCount+': 1 });
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
}) satisfies LayoutServerLoad;
