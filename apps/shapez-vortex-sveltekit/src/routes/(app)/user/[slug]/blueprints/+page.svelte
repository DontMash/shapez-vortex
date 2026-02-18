<script lang="ts">
  import type { PageProps } from './$types';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--schema] heading-2"></span>
    {data.seo.title}
  </PageHeader>

  {#if data.blueprints && data.blueprints.length > 0}
    <BlueprintItemList items={data.blueprints} images={data.images} />
  {:else}
    <div class="flex items-center justify-center">
      <span>No blueprints</span>
    </div>
  {/if}
</section>
