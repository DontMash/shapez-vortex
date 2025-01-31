<script lang="ts">
  import type { PageData } from './$types';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--bookmark-filled] heading-2" />
    {data.seo.title}
  </PageHeader>

  {#if data.bookmarks && data.bookmarks.length > 0}
    <BlueprintItemList items={data.bookmarks} images={data.images} />
  {:else}
    <div class="flex items-center justify-center">
      <span>No bookmarks</span>
    </div>
  {/if}
</section>
