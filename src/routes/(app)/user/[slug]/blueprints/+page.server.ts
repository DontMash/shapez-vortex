import type { PageServerLoad } from './$types';
import type { BlueprintRecord } from '$lib/blueprint';
import type { User } from '$lib/user.types';

export const load = (async ({ locals, parent }) => {
  const { profile } = await parent();
  const isYou = profile.id === locals.user?.id;

  const user = await locals.pb
    .collection('users')
    .getOne<Pick<User, 'expand'>>(profile.id, {
      expand: 'blueprints.tags,blueprints.creator',
      fields:
        'expand.blueprints.collectionId,expand.blueprints.id,expand.blueprints.title,expand.blueprints.images,expand.blueprints.creator,expand.blueprints.expand.tags.name,expand.blueprints.expand.creator.displayname',
    });
  const blueprints = (user.expand?.blueprints as Array<BlueprintRecord>) ?? [];
  const images = blueprints.reduce<Record<string, string>>(
    (result, current) => {
      if (current.images.length <= 0) return result;
      result[current.id] = locals.pb.files.getURL(current, current.images[0], {
        thumb: '600x400',
      });
      return result;
    },
    {},
  );

  return {
    seo: {
      title: `${isYou ? 'Your' : `${profile.displayname}'s`} blueprint library`,
      description: `View ${isYou ? 'your' : `${profile.displayname}'s`} collection of blueprints.`,
      keywords: ['Blueprint', 'Library'],
    },
    blueprints,
    images,
  };
}) satisfies PageServerLoad;
