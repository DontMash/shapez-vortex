<script lang="ts">
  import type { PageProps } from './$types';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--bookmark-filled] heading-2"></span>
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
