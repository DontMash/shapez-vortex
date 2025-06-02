<script lang="ts">
  import { AlertDialog } from 'bits-ui';
  import { fade } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import type { BlueprintRecord } from '$lib/blueprint';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';

  interface Props {
    blueprint: Pick<BlueprintRecord, 'id' | 'title'>;
  }

  let { blueprint }: Props = $props();

  let isDeleteDialogOpen = $state(false);
</script>

<AlertDialog.Root bind:open={isDeleteDialogOpen}>
  <AlertDialog.Trigger
    class={button({
      kind: 'ghost',
      intent: 'error',
      size: 'icon-sm',
    })}
    title="Delete blueprint"
  >
    <span class="icon-[tabler--trash]"></span>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay class={dialog.overlay()} />
    <AlertDialog.Content forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class={dialog.content({ position: 'center' })}
            transition:fade={{ duration: 150 }}
          >
            <div class="bg-layer relative rounded-lg border">
              <AlertDialog.Cancel
                class="{button({
                  kind: 'outline',
                  intent: 'muted',
                  size: 'icon-sm',
                })} absolute top-4 right-4"
              >
                <span class="icon-[tabler--x] text-lg">Close delete dialog</span
                >
              </AlertDialog.Cancel>

              <div class="min-h-16 border-b py-4 pr-16 pl-4">
                <AlertDialog.Title class="heading-4" level={2}>
                  Delete <em>{blueprint.title}</em>
                </AlertDialog.Title>
              </div>

              <div class="space-y-4 p-4">
                <AlertDialog.Description>
                  <p>
                    Are you sure about deleting <em>{blueprint.title}</em>?
                    <br />
                    <b>This action cannot be reverted!</b>
                  </p>
                </AlertDialog.Description>

                <div class="flex items-center gap-2">
                  <form
                    use:enhance={() => {
                      isDeleteDialogOpen = false;
                    }}
                    method="post"
                    action="/blueprint/{blueprint.id}/?/delete"
                  >
                    <button class={button({ intent: 'error' })} type="submit">
                      <span class="icon-[tabler--trash]"></span>
                      Delete
                    </button>
                  </form>

                  <AlertDialog.Cancel
                    class={button({ kind: 'outline', intent: 'muted' })}
                  >
                    <span class="icon-[tabler--x]"></span>
                    Cancel
                  </AlertDialog.Cancel>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/snippet}
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
