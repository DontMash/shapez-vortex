import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (() => {
    return {
        seo: {
            title: 'Settings - Account',
            description: 'Manage your account settings',
            keywords: ['Settings', 'Account'],
        },
    };
}) satisfies PageServerLoad;

export const actions = {
    verification: async ({ locals }) => {
        if (!locals.user) {
            redirect(303, 'login');
        }
        await locals.pb.collection('users').requestVerification(locals.user.email);
        return { success: true };
    },
    email: async ({ locals, request }) => {
        if (!locals.user) {
            redirect(303, 'login');
        }
        const formData = await request.formData();
        const entries = Object.fromEntries(formData);
        const schema = z.object({ newEmail: z.string().email() });
        const result = schema.safeParse(entries);
        if (!result.success) {
            return fail(400, { data: entries, issues: result.error.issues, invalid: true });
        }
        await locals.pb.collection('users').requestEmailChange(result.data.newEmail);
        return { success: true };
    },
} satisfies Actions;
