import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import {
  getColors,
  getLayerCount,
  parse,
  getPartCount,
  getTypes,
  DEFAULT_SHAPE,
  type ShapeData,
} from '$lib/shape';

export const load = (({ url }) => {
  try {
    const identifier = url.searchParams.get('identifier') ?? DEFAULT_SHAPE;
    const data = parse(identifier);
    const shape: ShapeData = {
      identifier,
      data,
      meta: {
        types: getTypes(data),
        colors: getColors(data),
        layerCount: getLayerCount(data),
        partCount: getPartCount(data),
      },
    };
    return {
      seo: {
        title: 'Shape Viewer Embed',
        description:
          "View and interact with the 3D visualization of a shape. Explore the shape's multiple layers and parts.",
        keywords: ['Viewer', '3D', 'Shape', 'Embed'],
      },
      shape,
      extend: url.searchParams.get('extend') === 'true',
      expand: url.searchParams.get('expand') === 'true',
    };
  } catch (err) {
    error(400, (err as Error).message);
  }
}) satisfies PageServerLoad;
