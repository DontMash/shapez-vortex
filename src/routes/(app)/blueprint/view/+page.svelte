<script lang="ts">
  import type { PageData } from './$types';

  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

  export let data: PageData;
</script>

<section class="relative mx-auto w-full max-w-5xl">
  <BlueprintView
    identifier={data.blueprint.identifier}
    blueprint={data.blueprint.data}
    controls={{ download: true, upload: true, zoom: true, utils: true }}
  />
</section>
