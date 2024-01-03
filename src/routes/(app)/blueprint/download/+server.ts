import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    const identifier = url.searchParams.get('identifier') as string;
    if (!identifier) {
        throw error(400, 'Invalid/missing identifier query parameter');
    }

    const codec = new TextEncoder();
    const data = codec.encode(identifier);

    return new Response(data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="blueprint.spz2bp"'
        }
    });
};
