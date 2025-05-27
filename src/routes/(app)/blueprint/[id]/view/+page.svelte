<script lang="ts">
  import type { PageProps } from './$types';

  import { section } from '$lib/components/section';

  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <BlueprintView
    title={data.blueprint.entry.title}
    identifier={data.blueprint.entry.data}
    blueprint={data.blueprint.data}
    controls={{
      download: true,
      zoom: true,
      utils: true,
    }}
  />
</section>
