<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    description?: Snippet;
  }

  let { children, description }: Props = $props();
</script>

<header class="mb-12 border-b pb-4">
  <hgroup>
    <h1 class="heading-2 flex items-center gap-2">
      {@render children?.()}
    </h1>
  </hgroup>
  {#if description}
    <p>
      {@render description?.()}
    </p>
  {/if}
</header>
