<script lang="ts">
  import type { PageProps } from './$types';
  import ShapeCanvas from '$lib/components/shape/ShapeCanvas.svelte';

  let { data }: PageProps = $props();
</script>

<div class="h-screen w-screen overflow-hidden bg-transparent">
  <ShapeCanvas
    data={data.shape}
    isExtended={data.extend}
    isExpanded={data.expand}
  />
</div>
