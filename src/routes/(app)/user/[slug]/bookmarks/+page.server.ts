import type { PageServerLoad } from './$types';
import type { BlueprintRecord } from '$lib/blueprint';
import type { User } from '$lib/user.types';

export const load = (async ({ locals, parent }) => {
  const { profile } = await parent();
  const isYou = profile.id === locals.user?.id;

  const user = await locals.pb
    .collection('users')
    .getOne<Pick<User, 'expand'>>(profile.id, {
      expand: 'bookmarks.tags,bookmarks.creator',
      fields: [
        'expand.bookmarks.collectionId',
        'expand.bookmarks.id',
        'expand.bookmarks.title',
        'expand.bookmarks.images',
        'expand.bookmarks.creator',
        'expand.bookmarks.expand.tags.id',
        'expand.bookmarks.expand.tags.name',
        'expand.bookmarks.expand.creator.displayname',
      ].join(','),
    });
  const bookmarks = (user.expand?.bookmarks as Array<BlueprintRecord>) ?? [];
  const images = bookmarks.reduce<Record<string, string>>((result, current) => {
    if (current.images.length <= 0) return result;
    result[current.id] = locals.pb.files.getURL(current, current.images[0], {
      thumb: '600x400',
    });
    return result;
  }, {});

  return {
    seo: {
      title: `${isYou ? 'Your' : `${profile.displayname}'s`} blueprint bookmarks`,
      description: `View ${isYou ? 'your' : `${profile.displayname}'s`} collection of bookmarks.`,
      keywords: ['Blueprint', 'Library'],
    },
    bookmarks,
    images,
  };
}) satisfies PageServerLoad;
