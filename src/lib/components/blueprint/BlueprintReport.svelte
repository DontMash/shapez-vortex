<script lang="ts">
  import { AlertDialog, Button, Select } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { fade, blur } from 'svelte/transition';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';
  import { page } from '$app/stores';
  import type { BlueprintRecord } from '$lib/blueprint.types';
  import { REPORT_CREATE_SCHEMA, REPORT_REASONS } from '$lib/report.types';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';
  import * as input from '$lib/components/input';

  export let form: SuperValidated<z.infer<typeof REPORT_CREATE_SCHEMA>>;
  export let blueprint: Pick<BlueprintRecord, 'id' | 'title'>;

  const reportForm = superForm(form, {
    validators: zodClient(REPORT_CREATE_SCHEMA),
    onError: 'apply',
    onResult({ result }) {
      if (result.type !== 'success') {
        return;
      }
      isReportDialogOpen = false;
    },
  });
  const { form: formData, enhance, delayed } = reportForm;
  $formData.blueprint = blueprint.id;
  const userId = $page.data.user?.id ?? '';
  $formData.user = userId;
  let isReportDialogOpen = false;
</script>

<AlertDialog.Root bind:open={isReportDialogOpen}>
  <AlertDialog.Trigger
    class={button({
      kind: 'ghost',
      intent: 'error',
      size: 'icon-sm',
    })}
    title="Report blueprint"
  >
    <span class="icon-[tabler--flag]" />
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
          <span class="icon-[tabler--x] text-lg">Close report dialog</span>
        </AlertDialog.Cancel>

        <div class="min-h-16 border-b py-4 pl-4 pr-16">
          <AlertDialog.Title class="heading-4" level="h2">
            Report <em>{blueprint.title}</em>
          </AlertDialog.Title>
        </div>

        <div class="space-y-4 p-4">
          <form
            class="flex flex-col gap-2"
            method="post"
            action="?/report"
            use:enhance
          >
            <input type="hidden" name="blueprint" value={blueprint.id} />
            <input type="hidden" name="user" value={userId} />

            <Field form={reportForm} name="reason" let:constraints>
              <Control let:attrs>
                <Label class="sr-only">Reason</Label>
                <Select.Root
                  name={attrs.name}
                  items={Object.entries(REPORT_REASONS).map(
                    ([value, label]) => ({
                      value,
                      label,
                    }),
                  )}
                  loop
                  {...constraints}
                >
                  <Select.Trigger
                    class="{button({
                      kind: 'outline',
                      intent: 'muted',
                    })} w-full min-w-64 bg-background"
                    {...attrs}
                    {...constraints}
                  >
                    <span class="icon-[tabler--message-report]" />
                    <Select.Value placeholder="Select a reason" />
                    <span class="icon-[tabler--caret-up-down] ml-auto" />
                  </Select.Trigger>

                  <Select.Input name="reason" bind:value={$formData.reason} />

                  <Select.Content
                    class="z-10 flex flex-col rounded-sm border bg-background p-2 shadow-lg"
                    sideOffset={8}
                  >
                    {#each Object.entries(REPORT_REASONS) as [value, label]}
                      <Select.Item
                        class="{button({
                          kind: 'ghost',
                          intent: 'muted',
                          size: 'sm',
                        })} data-[highlighted]:bg-muted"
                        {label}
                        {value}
                      >
                        {label}
                        <Select.ItemIndicator class="ml-auto flex items-center">
                          <span class="icon-[tabler--check]">Selected</span>
                        </Select.ItemIndicator>
                      </Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              </Control>
              <FieldErrors class="text-error" />
            </Field>

            <Field form={reportForm} name="message" let:constraints>
              <Control let:attrs>
                <Label class="{input.group()} max-h-none !items-start">
                  <span class="icon-[tabler--align-left] my-4">Message</span>
                  <textarea
                    class="{input.field()} max-h-[50vh] min-h-14 py-4"
                    rows="10"
                    placeholder="Message"
                    {...attrs}
                    {...constraints}
                    bind:value={$formData.message}
                  />
                </Label>
              </Control>
              <FieldErrors class="text-error" />
            </Field>

            <div class="flex items-center gap-2">
              <Button.Root class={button({ intent: 'error' })} type="submit">
                <span class="icon-[tabler--flag]" />
                Report
                {#if $delayed}
                  <span
                    class="icon-[tabler--loader-2] animate-spin"
                    transition:fade={{ duration: 150 }}
                  />
                {/if}
              </Button.Root>
              <AlertDialog.Cancel
                class={button({ kind: 'outline', intent: 'muted' })}
              >
                <span class="icon-[tabler--x]" />
                Cancel
              </AlertDialog.Cancel>
            </div>
          </form>
        </div>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
