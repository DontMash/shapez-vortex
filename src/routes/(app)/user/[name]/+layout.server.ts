import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/user.types';

export const load = (async ({ locals, params }) => {
    try {
        const user = await locals.pb.collection('users')
            .getFirstListItem<Pick<User, 'id' | 'username' | 'displayname'>>(
                `username="${params.name}"`,
                { fields: 'id,username,displayname', }
            );

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
