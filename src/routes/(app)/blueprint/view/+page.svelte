<script lang="ts">
  import type { PageData } from './$types';

  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;
</script>

<section class={section()}>
  <BlueprintView
    identifier={data.blueprint.identifier}
    blueprint={data.blueprint.data}
    controls={{ download: true, upload: true, zoom: true, utils: true }}
  />
</section>
