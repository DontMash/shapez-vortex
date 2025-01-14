<script lang="ts">
  import { page } from '$app/stores';
  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  function getPageUrl(pageIndex: number) {
    const url = new URL($page.url);
    url.searchParams.set('page', String(pageIndex));
    return url.href;
  }
</script>

<section class="mx-auto w-full max-w-5xl">
  <header
    class="mb-4 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
  >
    <h2 class="text-lg font-bold">
      <span class="icon-[tabler--search] align-text-bottom text-2xl" />
      {data.seo.title}
    </h2>
  </header>

  <form class="mb-8 flex flex-wrap items-end gap-2 px-4 lg:px-0">
    <label
      class="input input-sm input-bordered flex grow items-center space-x-2"
      for="query"
    >
      <span class="icon-[tabler--search] align-text-bottom text-lg" />
      <input
        class="grow bg-transparent"
        type="text"
        name="query"
        id="query"
        value={data.query}
        placeholder="Search"
      />
    </label>

    <label class="form-control w-full max-w-36" for="sort">
      <div class="label">
        <span class="label-text text-xs">Filter by tag:</span>
      </div>
      <select
        class="select select-bordered select-sm"
        id="filter"
        name="filter"
      >
        <option value="" selected={!data.filter}>-</option>
        {#each data.tags as tag}
          <option
            value={`tags=${tag.name}`}
            selected={data.filter?.includes(tag.name)}
          >
            #{tag.name}
          </option>
        {/each}
      </select>
    </label>

    <label class="form-control w-full max-w-36" for="sort">
      <div class="label">
        <span class="label-text text-xs">Sort by:</span>
      </div>
      <select class="select select-bordered select-sm" id="sort" name="sort">
        <option value="created" selected={!data.sort || data.sort === 'created'}
          >Created</option
        >
        <option value="updated" selected={data.sort === 'updated'}
          >Updated</option
        >
        <option value="title" selected={data.sort === 'title'}>Title</option>
        <option value="version" selected={data.sort === 'version'}
          >Version</option
        >
        <option value="cost" selected={data.sort === 'cost'}>Cost</option>
        <option value="buildingCount" selected={data.sort === 'buildingCount'}
          >Buildings</option
        >
        <option value="islandCount" selected={data.sort === 'islandCount'}
          >Islands</option
        >
        <option value="viewCount" selected={data.sort === 'viewCount'}
          >Views</option
        >
        <option value="downloadCount" selected={data.sort === 'downloadCount'}
          >Downloads</option
        >
        <option value="bookmarkCount" selected={data.sort === 'bookmarkCount'}
          >Bookmarks</option
        >
      </select>
    </label>

    <label class="form-control w-full max-w-36" for="order">
      <div class="label">
        <span class="label-text text-xs">Order in:</span>
      </div>
      <select class="select select-bordered select-sm" id="order" name="order">
        <option value="asc" selected={data.order === 'asc'}>↑ Ascending</option>
        <option value="desc" selected={!data.order || data.order === 'desc'}>
          ↓ Descending</option
        >
      </select>
    </label>

    <button
      class="btn btn-square btn-sm"
      title="Clear search parameters"
      type="reset"
    >
      <span class="icon-[tabler--x]">Clear</span>
    </button>
    <button class="btn btn-primary btn-sm" title="Apply search parameters">
      <span class="icon-[tabler--list-search]" />
      Apply
    </button>
  </form>

  {#if data.result.items && data.result.items.length > 0}
    <div class="px-4 lg:px-0">
      <BlueprintItemList items={data.result.items} images={data.images} />
    </div>

    {#key $page}
      <div class="mt-8 flex justify-center">
        <div class="join">
          {#if data.result.totalPages > 3}
            <a
              class="btn btn-square join-item"
              title="Go to the first page of results"
              href={getPageUrl(1)}
            >
              <span class="icon-[tabler--chevrons-left] text-2xl">First</span>
            </a>
          {/if}
          {#if data.result.totalPages > 1}
            <a
              class="btn btn-square join-item"
              title="Go to the previous page of results"
              href={getPageUrl(Math.max(data.result.page - 1, 1))}
            >
              <span class="icon-[tabler--chevron-left] text-2xl">Previous</span>
            </a>
          {/if}
          {#each [...Array(data.result.totalPages).keys()] as index}
            {@const page = index + 1}
            {@const diff = data.result.page - page}
            {#if diff < 3 && diff > -3}
              <a
                class={`btn btn-square ${data.result.totalPages > 1 ? 'join-item' : ''} ${
                  page === data.result.page ? 'btn-active' : ''
                }`}
                title="Go to page {page}}"
                href={getPageUrl(page)}
              >
                {page}
              </a>
            {/if}
          {/each}
          {#if data.result.totalPages > 1}
            <a
              class="btn btn-square join-item"
              title="Go to the next page of results"
              href={getPageUrl(
                Math.min(data.result.page + 1, data.result.totalPages),
              )}
            >
              <span class="icon-[tabler--chevron-right] text-2xl">Next</span>
            </a>
          {/if}
          {#if data.result.totalPages > 3}
            <a
              class="btn btn-square join-item"
              title="Go to the last page of results"
              href={getPageUrl(data.result.totalPages)}
            >
              <span class="icon-[tabler--chevrons-right] text-2xl">Last</span>
            </a>
          {/if}
        </div>
      </div>
    {/key}
  {:else}
    <div class="flex items-center justify-center">
      <span>No blueprints found</span>
    </div>
  {/if}
</section>
