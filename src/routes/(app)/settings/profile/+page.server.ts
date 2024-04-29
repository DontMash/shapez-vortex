import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { USERNAME_REGEX } from '$lib/user.types';

export const load = (async () => {
    return {
        seo: {
            title: 'Settings - Profile',
            description: 'Manage your profile settings',
            keywords: ['Settings', 'Profile'],
        },
    };
}) satisfies PageServerLoad;

export const actions = {
    updateDisplayname: async ({ locals, request }) => {
        if (!locals.user) {
            return fail(401);
        }
        if (!locals.user.verified) {
            return fail(400, { invalid: true, issues: [{ message: 'User not verified' }] });
        }

        const formData = await request.formData();
        const entries = Object.fromEntries(formData);
        const schema = z.object({ newDisplayname: z.string().regex(USERNAME_REGEX) });
        const result = schema.safeParse(entries);
        if (!result.success) {
            return fail(400, { data: entries, issues: result.error.issues, invalid: true });
        }

        await locals.pb.collection('users').update(locals.user.id, { displayname: result.data.newDisplayname });
        return { success: true };
    },
} satisfies Actions;
