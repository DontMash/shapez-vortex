<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from 'bits-ui';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { z } from 'zod';
  import { copy } from '$lib/client/actions/clipboard.svelte';
  import ToastService from '$lib/client/toast.svelte';
  import type { BlueprintRecord } from '$lib/blueprint';
  import { REPORT_CREATE_SCHEMA } from '$lib/report';
  import type { User } from '$lib/user.schema';

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

  const toastService = ToastService.instance;
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
    oncopy: () => toastService.add({ message: 'Blueprint url copied.' }),
  })}
>
  <span class="icon-[tabler--share]"></span>
  <span class="sr-only">Share blueprint</span>
</button>
