import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const title = url.searchParams.get('title');
    if (!title) {
        return new Response(JSON.stringify({ items: [] }));
    }
    const expand: Array<string> = ['tags', 'creator'];
    const fields = ['collectionId', 'id', 'title', 'images', 'expand.tags.name', 'expand.creator.displayname', 'expand.creator.username'];
    const blueprints = await locals.pb.collection('blueprints').getList(1, 20,
        {
            expand: expand.join(','),
            fields: fields.join(','),
            filter: `title~"${title}"`
        }
    );
    return new Response(JSON.stringify(blueprints));
};
