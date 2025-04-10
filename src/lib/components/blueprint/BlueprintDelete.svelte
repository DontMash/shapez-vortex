<script lang="ts">
  import { AlertDialog } from 'bits-ui';
  import { blur, fade } from 'svelte/transition';
  import type { BlueprintRecord } from '$lib/blueprint.types';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';

  export let blueprint: Pick<BlueprintRecord, 'id' | 'title'>;

  let isDeleteDialogOpen = false;
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
          <span class="icon-[tabler--x] text-lg">Close delete dialog</span>
        </AlertDialog.Cancel>

        <div class="min-h-16 border-b py-4 pl-4 pr-16">
          <AlertDialog.Title class="heading-4" level="h2">
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
            <form method="post" action="/blueprint/{blueprint.id}/?/delete">
              <button class={button({ intent: 'error' })} type="submit">
                <span class="icon-[tabler--trash]" />
                Delete
              </button>
            </form>

            <AlertDialog.Cancel
              class={button({ kind: 'outline', intent: 'muted' })}
            >
              <span class="icon-[tabler--x]" />
              Cancel
            </AlertDialog.Cancel>
          </div>
        </div>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
