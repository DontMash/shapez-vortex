<script lang="ts">
  import type { PageProps } from './$types';

  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';
  import { section } from '$lib/components/section';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <BlueprintView
    identifier={data.blueprint.identifier}
    blueprint={data.blueprint.data}
    controls={{ download: true, upload: true, zoom: true, utils: true }}
  />
</section>
