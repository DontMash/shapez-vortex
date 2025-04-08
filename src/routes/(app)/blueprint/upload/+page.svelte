<script lang="ts">
  import type { PageData } from './$types';

  import BlueprintForm from '$lib/components/blueprint/BlueprintForm.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--upload] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      {data.seo.description}
    </svelte:fragment>
  </PageHeader>

  <BlueprintForm data={{ form: data.form, type: 'create', tags: data.tags }} />
</section>
