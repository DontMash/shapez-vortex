<script lang="ts">
  import { Button } from 'bits-ui';
  import { page } from '$app/stores';
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import BlueprintInteraction from './BlueprintInteraction.svelte';
  import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
  import { button } from '$lib/components/button';
  import UserTag from '$lib/components/UserTag.svelte';

  export let data: Pick<BlueprintRecord, 'id' | 'title' | 'creator' | 'expand'>;
  export let image: string;
</script>

<article
  class="grid grid-cols-1 divide-x divide-border overflow-hidden rounded-md border bg-layer shadow-lg md:grid-cols-3"
>
  <a href="/blueprint/{data.id}">
    <figure class="aspect-h-2 aspect-w-3">
      {#if image}
        <img class="object-cover" src={image} alt="Preview of {data.title}" />
      {:else}
        <img
          class="object-contain p-8"
          src="/favicon.png"
          alt="Preview placeholder for {data.title}"
        />
      {/if}
    </figure>
  </a>

  <div class="col-span-2 space-y-2 p-4">
    <div class="flex items-center">
      {#if data.expand && data.expand['creator']}
        <UserTag name={data.expand['creator'].displayname} />
      {/if}

      <div class="ml-auto flex items-center gap-4">
        <BlueprintInteraction user={$page.data.user} blueprint={data} />
      </div>
    </div>

    <Button.Root class={button({ kind: 'link' })} href="/blueprint/{data.id}">
      <h3 class="heading-3">
        {data.title}
      </h3>
    </Button.Root>

    {#if data.expand && data.expand['tags']}
      <ul class="flex items-center gap-2">
        {#each data.expand['tags'] as tag}
          <li class="shrink-0">
            <BlueprintTag data={tag} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</article>
