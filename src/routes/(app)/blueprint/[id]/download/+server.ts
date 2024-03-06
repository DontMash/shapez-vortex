import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params, url }) => {
    const downloadUrl = new URL('/api/v1/blueprint/download', url.origin);
    downloadUrl.searchParams.append('id', params.id);
    return fetch(downloadUrl.href);
};
