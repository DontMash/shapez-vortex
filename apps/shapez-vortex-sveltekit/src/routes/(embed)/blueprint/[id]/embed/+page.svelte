<script lang="ts">
  import type { PageProps } from './$types';
  import BlueprintCanvas from '$lib/components/blueprint/BlueprintCanvas.svelte';

  let { data }: PageProps = $props();
</script>

<div class="relative h-screen w-screen overflow-hidden bg-transparent">
  <BlueprintCanvas blueprint={data.blueprint.data} />

  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    class="text-foreground/50 hover:text-foreground absolute right-2 bottom-2 z-10 text-xs font-medium tracking-wide drop-shadow-sm transition"
    href="/blueprint/{data.blueprint.entry.id}"
    target="_blank"
    rel="noopener noreferrer"
    title="View this blueprint in Shapez Vortex"
  >
    Shapez Vortex
  </a>
</div>
