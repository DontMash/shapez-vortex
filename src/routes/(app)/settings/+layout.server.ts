import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (({ locals, url }) => {
    if (!locals.user) {
        const loginUrl = new URL('login', url.origin);
        loginUrl.searchParams.set('redirect', url.pathname);
        redirect(303, loginUrl.href);
    }

    const pages = [
        {
            name: 'Profile',
            path: '/settings/profile',
        },
        {
            name: 'Account',
            path: '/settings/account',
        },
    ];
    return {
        pages
    };
}) satisfies LayoutServerLoad;
