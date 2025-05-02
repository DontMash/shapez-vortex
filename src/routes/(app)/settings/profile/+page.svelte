<script lang="ts">
  import type { PageData } from './$types';
  import { Tooltip } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  export let data: PageData;

  const form = superForm(data.form);
  const { form: formData, enhance } = form;
</script>

<section>
  <form class="flex items-start gap-2" method="post" use:enhance>
    <Field {form} name="displayname" let:constraints>
      <div class="flex flex-1 flex-col gap-2">
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--abc]">Displayname</span>
            <input
              class={input.field()}
              type="text"
              placeholder="Displayname"
              {...attrs}
              {...constraints}
              bind:value={$formData.displayname}
            />
            <Tooltip.Root>
              <Tooltip.Trigger
                class={button({
                  kind: 'ghost',
                  intent: 'muted',
                  size: 'icon-sm',
                })}
              >
                <span class="icon-[tabler--info-circle]" />
              </Tooltip.Trigger>
              <Tooltip.Content class="max-w-60 rounded-md border bg-layer p-2">
                <p>The name you want others to see when viewing you content.</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Label>
        </Control>
        <FieldErrors class="text-error" />
      </div>
    </Field>

    <button class={button()}>
      <span class="icon-[tabler--refresh]" />
      Update
    </button>
  </form>
</section>
