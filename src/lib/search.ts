import type { SearchOrderOption, SearchSortOption } from "./search.schema";

export const SEARCH_SORT_OPTION_DEFAULT: SearchSortOption = 'created';
export const SEARCH_SORT_OPTIONS: Record<SearchSortOption, string> = {
    created: "Created",
    updated: "Update",
    version: "Version",
    buildingCount: "Buildings",
    islandCount: "Islands",
    viewCount: "Views",
    downloadCount: "Download",
    bookmarkCount: "Bookmarks",
};

export const SEARCH_ORDER_OPTION_DEFAULT: SearchOrderOption = 'desc';
export const SEARCH_ORDER_OPTIONS: Record<SearchOrderOption, string> = {
    asc: "Ascending",
    desc: "Descending",
};


export const PAGINATION_PAGE_DEFAULT = 1;
export const PAGINATION_PER_PAGE_DEFAULT = 10;