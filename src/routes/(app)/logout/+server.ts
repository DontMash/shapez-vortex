import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
    locals.pb.authStore.clear();

    redirect(303, '/');
};
