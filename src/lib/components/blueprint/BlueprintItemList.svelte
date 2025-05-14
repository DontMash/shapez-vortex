<script lang="ts">
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import BlueprintItem from './BlueprintItem.svelte';

  interface Props {
    items: Array<BlueprintRecord>;
    images: Record<string, string>;
  }

  let { items, images }: Props = $props();
</script>

<ul class="space-y-4">
  {#each items as blueprint (blueprint.id)}
    {@const preview = images && images[blueprint.id]}
    <li>
      <BlueprintItem data={blueprint} image={preview} />
    </li>
  {/each}
</ul>
