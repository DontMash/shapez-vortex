import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

export const GET: RequestHandler = ({ url }) => {
    const identifier = url.searchParams.get('identifier') as string;
    if (!identifier) {
        error(400, 'Invalid/missing identifier query parameter');
    }
    const name = url.searchParams.get('name') as string || 'blueprint';
    
    const codec = new TextEncoder();
    const data = codec.encode(identifier);

    return new Response(data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${name}${BLUEPRINT_FILE_FORMAT}"`
        }
    });
};
