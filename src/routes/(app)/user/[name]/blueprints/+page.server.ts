import type { BlueprintData } from '$lib/blueprint.types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
    const { profile } = await parent();
    const isYou = profile.id === locals.user?.id;
    const blueprints = profile.expand?.blueprints as Array<BlueprintData>;
    const images = blueprints.reduce<Record<string, string>>((result, current) => {
        if (current.images.length <= 0) return result;
        result[current.id] = locals.pb.files.getUrl(current, current.images[0], { thumb: '600x400' });
        return result;
    }, {});

    return {
        seo: {
            title: `${isYou ? 'Your' : `${profile.username}'s`} blueprint library`,
            description: `View ${isYou ? 'your' : `${profile.username}'s`} collection of blueprints.`,
            keywords: ['Blueprint', 'Library'],
        },
        blueprints,
        images,
    };
}) satisfies PageServerLoad;
