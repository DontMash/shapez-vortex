import type { RequestHandler } from './$types';

const MAX_PAGE_ENTRIES = 10;

export const GET: RequestHandler = async ({ locals, url }) => {
    const sort = ['id'];
    const sortParams = url.searchParams.get('sort');
    const orderParams = url.searchParams.get('order');
    sort.unshift(`${orderParams === 'desc' ? '-' : ''}${sortParams}` ?? 'created');
    let filter = '';
    const query = url.searchParams.get('query');
    if (query) {
        filter += `title~"${query}"`;
    }
    const filterParams = url.searchParams.get('filter');
    if (filterParams) {
        const options = filterParams.split(',');
        options.forEach(option => {
            const [key, value] = option.split('=');
            filter += `&&${key}?~"${value}"`;
        });
    }

    const page = parseInt(url.searchParams.get('page') ?? "1");
    const expand: Array<string> = ['tags', 'creator'];
    const fields = ['collectionId', 'id', 'title', 'images', 'creator', 'expand.tags.id', 'expand.tags.name', 'expand.creator.displayname'];
    const blueprints = await locals.pb.collection('blueprints').getList(page, MAX_PAGE_ENTRIES,
        {
            expand: expand.join(','),
            fields: fields.join(','),
            sort: sort.join(','),
            filter,
        }
    );

    return new Response(JSON.stringify(blueprints));
};
