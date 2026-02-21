<script lang="ts">
  import type { PageProps } from './$types';
  import BlueprintCanvas from '$lib/components/blueprint/BlueprintCanvas.svelte';

  let { data }: PageProps = $props();
</script>

<div class="h-screen w-screen overflow-hidden bg-transparent">
  <BlueprintCanvas blueprint={data.blueprint.data} />
</div>
