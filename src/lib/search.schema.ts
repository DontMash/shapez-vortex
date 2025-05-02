import { z } from 'zod';
import {
  PAGINATION_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_DEFAULT,
  SEARCH_ORDER_OPTION_DEFAULT,
  SEARCH_SORT_OPTION_DEFAULT,
} from './search';

const SEARCH_SORT_SCHEMA = z.union([
  z.literal('created'),
  z.literal('updated'),
  z.literal('version'),
  z.literal('buildingCount'),
  z.literal('islandCount'),
  z.literal('viewCount'),
  z.literal('downloadCount'),
  z.literal('bookmarkCount'),
]);
export type SearchSortOption = z.infer<typeof SEARCH_SORT_SCHEMA>;

const SEARCH_ORDER_SCHEMA = z.union([z.literal('asc'), z.literal('desc')]);
export type SearchOrderOption = z.infer<typeof SEARCH_ORDER_SCHEMA>;

export const SEARCH_SCHEMA = z.object({
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: SEARCH_SORT_SCHEMA.optional().default(SEARCH_SORT_OPTION_DEFAULT),
  order: SEARCH_ORDER_SCHEMA.optional().default(SEARCH_ORDER_OPTION_DEFAULT),
});

export const PAGINATION_SCHEMA = z.object({
  page: z.number().optional().default(PAGINATION_PAGE_DEFAULT),
  perPage: z.number().optional().default(PAGINATION_PER_PAGE_DEFAULT),
});
