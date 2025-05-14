<script lang="ts">
  import type { PageProps } from './$types';
  import { Tooltip } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { page } from '$app/state';

  let { data }: PageProps = $props();

  const form = superForm(data.form);
  const { form: formData, enhance } = form;

  $effect(() => {
    if (!$formData.displayname) {
      $formData.displayname = page.data.user?.displayname ?? '';
    }
  });
</script>

<section>
  <form class="flex items-start gap-2" method="post" use:enhance>
    <Field {form} name="displayname">
      {#snippet children({ constraints })}
        <div class="flex flex-1 flex-col gap-2">
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--abc]">Displayname</span>
                <input
                  class={input.field()}
                  type="text"
                  placeholder="Displayname"
                  {...props}
                  {...constraints}
                  bind:value={$formData.displayname}
                />
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger
                      class={button({
                        kind: 'ghost',
                        intent: 'muted',
                        size: 'icon-sm',
                      })}
                    >
                      <span class="icon-[tabler--info-circle]"></span>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      class="max-w-60 rounded-md border bg-layer p-2"
                    >
                      <p>
                        The name you want others to see when viewing you
                        content.
                      </p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        </div>
      {/snippet}
    </Field>

    <button class={button()}>
      <span class="icon-[tabler--refresh]"></span>
      Update
    </button>
  </form>
</section>
