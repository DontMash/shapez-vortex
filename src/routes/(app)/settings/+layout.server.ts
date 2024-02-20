import type { LayoutServerLoad } from './$types';

export const load = (() => {
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
