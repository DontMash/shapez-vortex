<script lang="ts">
  import { Button, AlertDialog } from 'bits-ui';
  import { blur, fade } from 'svelte/transition';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { copy } from '$lib/client/actions/clipboard';
  import { add } from '$lib/client/toast.service';
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';
  import UserTag from '$lib/components/UserTag.svelte';

  export let data: Partial<BlueprintRecord>;
  export let image: string;
  export let url: string;
  export let isEditable: boolean = false;
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

      <div class="!ml-auto flex items-center gap-4">
        <button
          class={button({ kind: 'ghost', intent: 'muted', size: 'icon-sm' })}
          title="Share blueprint"
          use:copy={{ value: url }}
          on:copy={() => add({ message: 'Link copied' })}
          on:error={(event) =>
            add({ message: event.detail.message, type: 'ERROR' })}
        >
          <span class="icon-[tabler--share]" />
        </button>
        {#if isEditable}
          <Button.Root
            class={button({ kind: 'ghost', intent: 'accent', size: 'icon-sm' })}
            title="Edit blueprint"
            href={`/blueprint/${data.id}/edit`}
          >
            <span class="icon-[tabler--edit]" />
          </Button.Root>

          <AlertDialog.Root>
            <AlertDialog.Trigger
              class={button({
                kind: 'ghost',
                intent: 'error',
                size: 'icon-sm',
              })}
              title="Deletes blueprint"
            >
              <span class="icon-[tabler--trash]" />
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay
                class={dialog.overlay()}
                transition={blur}
                transitionConfig={{ duration: 150 }}
              />
              <AlertDialog.Content
                class={dialog.content({ position: 'center' })}
                transition={fade}
                transitionConfig={{ duration: 150 }}
              >
                <div class="relative rounded-lg border bg-layer">
                  <AlertDialog.Cancel
                    class="{button({
                      kind: 'outline',
                      intent: 'muted',
                      size: 'icon-sm',
                    })} absolute right-4 top-4"
                  >
                    <span class="icon-[tabler--x] text-lg"
                      >Close delete dialog</span
                    >
                  </AlertDialog.Cancel>

                  <AlertDialog.Title
                    class="heading-4 mb-2 border-b py-4 pl-4 pr-16"
                    level="h3"
                  >
                    Delete <em>{data.title}</em>
                  </AlertDialog.Title>
                  <AlertDialog.Description class="p-4">
                    Are you sure about deleting <em>{data.title}</em>? <br />
                    <b>This action cannot be reverted!</b>
                  </AlertDialog.Description>

                  <div class="flex items-center gap-2 p-4">
                    <AlertDialog.Action
                      class={button({ intent: 'error' })}
                      on:click={async () => {
                        const url = new URL(
                          `/api/v1/blueprint/${data.id}`,
                          $page.url.origin,
                        );
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
                        } catch {
                          add({
                            message: 'Error while deleting blueprint',
                            type: 'ERROR',
                          });
                        }
                      }}
                    >
                      <span class="icon-[tabler--trash]" />
                      Delete
                    </AlertDialog.Action>
                    <AlertDialog.Cancel
                      class={button({ kind: 'outline', intent: 'muted' })}
                    >
                      <span class="icon-[tabler--x]" />
                      Cancel
                    </AlertDialog.Cancel>
                  </div>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        {/if}
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
          <li>
            <BlueprintTag data={tag} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</article>
