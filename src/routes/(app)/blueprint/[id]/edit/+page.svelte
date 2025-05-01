<script lang="ts">
  import type { PageData } from './$types';

  import BlueprintForm from '$lib/components/blueprint/BlueprintForm.svelte';
  import { section } from '$lib/components/section';

  import PageHeader from '$lib/components/PageHeader.svelte';

  export let data: PageData;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--edit] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      {data.seo.description}
    </svelte:fragment>
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
