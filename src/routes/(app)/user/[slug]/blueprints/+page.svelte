<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';

  export let data: PageData;
</script>

<section class="relative mx-auto w-full max-w-5xl">
  <header
    class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
  >
    <h2 class="inline-flex flex-grow items-center space-x-2 text-lg font-bold">
      <span class="icon-[tabler--schema] align-text-bottom text-2xl" />
      {data.seo.title}
    </h2>
  </header>

  {#if data.blueprints && data.blueprints.length > 0}
    <div class="px-4 lg:px-0">
      <BlueprintItemList items={data.blueprints} images={data.images} />
    </div>
  {:else}
    <div class="flex items-center justify-center">
      <span>No blueprints</span>
    </div>
  {/if}
</section>
