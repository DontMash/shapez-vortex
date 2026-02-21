<script lang="ts">
  import type { PageProps } from './$types';
  import ShapeCanvas from '$lib/components/shape/ShapeCanvas.svelte';

  let { data }: PageProps = $props();
</script>

<div class="relative h-screen w-screen overflow-hidden bg-transparent">
  <ShapeCanvas
    data={data.shape}
    isExtended={data.extend}
    isExpanded={data.expand}
  />

  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    class="text-foreground/50 hover:text-foreground absolute right-2 bottom-2 z-10 text-xs font-medium tracking-wide drop-shadow-sm transition"
    href="/shape?identifier={data.shape.identifier}"
    target="_blank"
    rel="noopener noreferrer"
    title="View this shape in Shapez Vortex"
  >
    Shapez Vortex
  </a>
</div>
