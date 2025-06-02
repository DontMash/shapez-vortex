<script lang="ts">
  import { Button } from 'bits-ui';
  import { page } from '$app/state';
  import type { BlueprintRecord } from '$lib/blueprint';

  import BlueprintInteraction from './BlueprintInteraction.svelte';
  import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
  import { button } from '$lib/components/button';
  import UserTag from '$lib/components/UserTag.svelte';

  interface Props {
    data: Pick<BlueprintRecord, 'id' | 'title' | 'creator' | 'expand'>;
    image: string;
  }

  let { data, image }: Props = $props();
</script>

<article
  class="divide-border bg-layer grid grid-cols-1 divide-x overflow-hidden rounded-md border shadow-lg md:grid-cols-3"
>
  <Button.Root href="/blueprint/{data.id}">
    {#if image}
      <img
        class="aspect-[3/2] w-full object-cover"
        src={image}
        alt="Preview of {data.title}"
      />
    {:else}
      <img
        class="aspect-[3/2] w-full object-contain p-8"
        src="/favicon.png"
        alt="Preview placeholder for {data.title}"
      />
    {/if}
  </Button.Root>

  <div class="col-span-2 space-y-2 p-4">
    <div class="flex items-center">
      {#if data.expand && data.expand['creator']}
        <UserTag name={data.expand['creator'].displayname} />
      {/if}

      <div class="ml-auto flex items-center gap-4">
        <BlueprintInteraction user={page.data.user} blueprint={data} />
      </div>
    </div>

    <Button.Root class={button({ kind: 'link' })} href="/blueprint/{data.id}">
      <h3 class="heading-3">
        {data.title}
      </h3>
    </Button.Root>

    {#if data.expand && data.expand['tags']}
      <ul class="flex items-center gap-2">
        {#each data.expand['tags'] as tag (tag.id)}
          <li class="shrink-0">
            <BlueprintTag data={tag} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</article>
