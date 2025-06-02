import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import {
  POCKETBASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from '$env/static/private';
import { decode, type BlueprintRecord } from '$lib/blueprint';
import type { User } from '$lib/user';

export const load = (async ({ depends, locals, params }) => {
  try {
    const blueprint = await locals.pb
      .collection('blueprints')
      .getOne<BlueprintRecord>(params.id, { expand: 'tags,creator' });
    const images = blueprint.images.map((image) => ({
      thumbnail: locals.pb.files.getURL(blueprint, image, {
        thumb: '600x400',
      }),
      src: locals.pb.files.getURL(blueprint, image),
    }));
    const data = decode(blueprint.data);

    let user = undefined;
    if (locals.user) {
      user = await locals.pb.collection('users').getOne<User>(locals.user?.id);
    }

    try {
      if (
        locals.user &&
        locals.user.verified &&
        locals.user.id !== blueprint.creator
      ) {
        const pb = new PocketBase(POCKETBASE_URL);
        await pb
          .collection('_superusers')
          .authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        await pb
          .collection('blueprints')
          .update(blueprint.id, { 'viewCount+': 1 });
      }
    } catch (err) {
      console.error(err);
    }

    depends('blueprint:update');
    const title = `Blueprint - ${blueprint.title}`;
    return {
      seo: {
        title,
        description: blueprint.description,
        og: {
          title,
          image: images.length > 0 ? images[0].src : undefined,
        },
      },
      blueprint: {
        entry: blueprint,
        images,
        data,
        user,
      },
    };
  } catch {
    error(404, 'Blueprint not found');
  }
}) satisfies LayoutServerLoad;
