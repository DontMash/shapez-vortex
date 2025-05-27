<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from 'bits-ui';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { z } from 'zod';
  import type { BlueprintRecord } from '$lib/blueprint.types';
  import { copy } from '$lib/client/actions/clipboard.svelte';
  import { add } from '$lib/client/toast.service';
  import { REPORT_CREATE_SCHEMA } from '$lib/report.types';
  import type { User } from '$lib/user.types';

  import BlueprintDelete from '$lib/components/blueprint/BlueprintDelete.svelte';
  import BlueprintReport from '$lib/components/blueprint/BlueprintReport.svelte';
  import { button } from '$lib/components/button';

  interface Props {
    user: User | undefined;
    blueprint: Pick<BlueprintRecord, 'id' | 'title' | 'creator'>;
    reportForm?:
      | SuperValidated<z.infer<typeof REPORT_CREATE_SCHEMA>>
      | undefined;
  }

  let { user, blueprint, reportForm = undefined }: Props = $props();
</script>

{#if user}
  {#if user.id === blueprint.creator}
    <Button.Root
      class={button({
        kind: 'ghost',
        intent: 'secondary',
        size: 'icon-sm',
      })}
      title="Edit blueprint"
      href={`/blueprint/${blueprint.id}/edit`}
    >
      <span class="icon-[tabler--edit]">Edit</span>
    </Button.Root>

    <BlueprintDelete {blueprint} />
  {:else}
    {@const isBookmarked = user?.bookmarks.includes(blueprint.id)}
    <form
      class="contents"
      action="/blueprint/{blueprint.id}/?/bookmark"
      method="post"
      use:enhance
    >
      <button
        class={button({
          kind: 'ghost',
          intent: 'primary',
          size: 'icon-sm',
        })}
        title="{isBookmarked ? 'Unbookmark' : 'Bookmark'} blueprint"
      >
        {#if isBookmarked}
          <span class="icon-[tabler--bookmark-filled]">Bookmark</span>
        {:else}
          <span class="icon-[tabler--bookmark]">Bookmark</span>
        {/if}
      </button>
    </form>

    {#if reportForm}
      <BlueprintReport form={reportForm} {blueprint} />
    {/if}
  {/if}
{/if}

<button
  class={button({ kind: 'ghost', intent: 'muted', size: 'icon-sm' })}
  {@attach copy({
    value: window.location.href,
    oncopy: () => add({ message: 'Blueprint url copied.' }),
  })}
>
  <span class="icon-[tabler--share]"></span>
  <span class="sr-only">Share blueprint</span>
</button>
