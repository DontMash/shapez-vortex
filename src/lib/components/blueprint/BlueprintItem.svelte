<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { copy } from '$lib/client/actions/clipboard';
  import { add } from '$lib/client/toast.service';
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
  import Dialog from '$lib/components/Dialog.svelte';
  import UserTag from '$lib/components/UserTag.svelte';

  export let data: Partial<BlueprintRecord>;
  export let image: string;
  export let url: string;
  export let isEditable: boolean = false;

  let deleteDialog: Dialog;
</script>

<article
  class="grid grid-cols-1 divide-x divide-base-content/20 overflow-hidden rounded-box border border-base-content/20 bg-base-200 shadow-lg md:grid-cols-3"
>
  <a href="/blueprint/{data.id}">
    <figure class="aspect-h-4 aspect-w-6">
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
    <div class="flex items-center space-x-2">
      {#if data.expand && data.expand['creator']}
        <UserTag name={data.expand['creator'].displayname} />
      {/if}

      <div class="!ml-auto flex items-center space-x-1">
        <button
          class="btn btn-square btn-ghost btn-sm"
          title="Share blueprint"
          use:copy={{ value: url }}
          on:copy={() => add({ message: 'Link copied' })}
          on:error={(event) =>
            add({ message: event.detail.message, type: 'ERROR' })}
        >
          <span class="icon-[tabler--share] text-2xl" />
        </button>
        {#if isEditable}
          <a
            class="btn btn-square btn-secondary btn-sm"
            title="Edit blueprint"
            href={`/blueprint/${data.id}/edit`}
          >
            <span class="icon-[tabler--edit] text-2xl" />
          </a>
          <button
            class="btn btn-square btn-error btn-sm"
            on:click={() => deleteDialog.show()}
          >
            <span class="icon-[tabler--trash] text-2xl" />
          </button>
        {/if}
      </div>
    </div>

    <a
      class="link-hover link transition-colors hover:text-primary"
      href="/blueprint/{data.id}"
    >
      <h3 class="text-3xl font-bold">
        {data.title}
      </h3>
    </a>

    {#if data.expand && data.expand['tags']}
      <ul>
        {#each data.expand['tags'] as tag}
          <li class="inline">
            <BlueprintTag data={tag} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if isEditable}
    <Dialog bind:this={deleteDialog}>
      <div class="p-6">
        <h4 class="mb-16 text-3xl font-bold">
          Do you want to delete <br />
          {data.title}?
        </h4>
        <div class="flex items-center justify-end space-x-2">
          <form
            class="inline"
            action="/api/v1/blueprint/{data.id}"
            method="post"
            on:submit|preventDefault={async (event) => {
              deleteDialog.close();

              const url = new URL(event.currentTarget.action, $page.url.origin);
              try {
                const response = await fetch(url, {
                  method: 'delete',
                });
                if (!response.ok) {
                  return add({
                    message: 'Failed to delete blueprint',
                    type: 'ERROR',
                  });
                }

                await invalidateAll();
                add({
                  message: 'Successfully deleted blueprint',
                  type: 'SUCCESS',
                });
              } catch (_) {
                add({
                  message: 'Error while deleting blueprint',
                  type: 'ERROR',
                });
              }
            }}
          >
            <button class="btn btn-error">
              <span class="icon-[tabler--trash] text-2xl" />
              Delete
            </button>
          </form>
          <form method="dialog">
            <button class="btn btn-neutral">
              <span class="icon-[tabler--x] text-2xl" />
              Cancel
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  {/if}
</article>
