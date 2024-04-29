import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/user.types';

export const load = (async ({ depends, locals, params }) => {
    try {
        let user: Pick<User, 'id' | 'displayname'>;
        if (params.slug.startsWith('@')) {
            user = await locals.pb.collection('users')
                .getFirstListItem(
                    `displayname="${params.slug.slice(1)}"`,
                    { fields: 'id,displayname', }
                );
        } else {
            user = await locals.pb.collection('users').getOne(params.slug);
        }

        return {
            seo: {
                title: user.displayname,
                description: `User profile of ${user.displayname}`,
                keywords: ['Blueprint', 'Library', 'Shape'],
            },
            profile: user,
        };
    } catch (err) {
        error(404, 'User not found');
    }
}) satisfies LayoutServerLoad;
