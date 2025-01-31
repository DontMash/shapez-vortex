<script lang="ts">
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import BlueprintItem from './BlueprintItem.svelte';

  export let items: Array<BlueprintRecord>;
  export let images: Record<string, string>;
</script>

<ul class="space-y-4">
  {#each items as blueprint}
    {@const preview = images && images[blueprint.id]}
    <li>
      <BlueprintItem data={blueprint} image={preview} />
    </li>
  {/each}
</ul>
