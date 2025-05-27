<script lang="ts">
  import type { PageProps } from './$types';

  import { section } from '$lib/components/section';

  import BlueprintForm from '$lib/components/blueprint/BlueprintForm.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--edit] heading-2"></span>
    {data.seo.title}

    {#snippet description()}
      {data.seo.description}
    {/snippet}
  </PageHeader>

  <BlueprintForm
    data={{
      form: data.form,
      type: 'update',
      tags: data.tags,
      record: data.blueprint.entry,
      images: data.blueprint.images,
    }}
  />
</section>
