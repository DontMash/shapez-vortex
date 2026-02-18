<script lang="ts">
  import { AlertDialog, Button, Select } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { fade } from 'svelte/transition';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { z } from 'zod';
  import { page } from '$app/state';
  import type { BlueprintRecord } from '$lib/blueprint';
  import { REPORT_CREATE_SCHEMA, REPORT_REASONS } from '$lib/report';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';
  import * as input from '$lib/components/input';

  interface Props {
    form: SuperValidated<z.infer<typeof REPORT_CREATE_SCHEMA>>;
    blueprint: Pick<BlueprintRecord, 'id' | 'title'>;
  }

  let { form, blueprint }: Props = $props();

  const reportForm = superForm(form, {
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
  const userId = page.data.user?.id ?? '';
  $formData.user = userId;
  let isReportDialogOpen = $state(false);

  const reasons = Object.entries(REPORT_REASONS);
  const selectedLabel = $derived(
    reasons.find(([key]) => key === $formData.reason)?.at(1) ??
      'Select a theme',
  );
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
    <span class="icon-[tabler--flag]"></span>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay class={dialog.overlay()} />
    <AlertDialog.Content>
      <div
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
            <span class="icon-[tabler--x] text-lg">Close report dialog</span>
          </AlertDialog.Cancel>

          <div class="min-h-16 border-b py-4 pr-16 pl-4">
            <AlertDialog.Title class="heading-4" level={2}>
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

              <Field form={reportForm} name="reason">
                {#snippet children({ constraints })}
                  <Control>
                    {#snippet children({ props })}
                      <Label class="sr-only">Reason</Label>
                      <Select.Root
                        type="single"
                        name={props.name}
                        loop
                        items={Object.entries(REPORT_REASONS).map(
                          ([value, label]) => ({
                            value,
                            label,
                          }),
                        )}
                        {...constraints}
                        bind:value={$formData.reason}
                      >
                        <Select.Trigger
                          class="{button({
                            kind: 'outline',
                            intent: 'muted',
                          })} bg-background w-full min-w-64"
                          aria-label="Select a reason"
                          {...props}
                          {...constraints}
                        >
                          <span class="icon-[tabler--message-report]"></span>
                          {selectedLabel}
                          <span class="icon-[tabler--caret-up-down] ml-auto"
                          ></span>
                        </Select.Trigger>

                        <Select.Content
                          class="bg-background z-10 flex flex-col rounded-sm border p-2 shadow-lg"
                          sideOffset={8}
                        >
                          {#each reasons as [value, label] (value)}
                            <Select.Item
                              class="{button({
                                kind: 'ghost',
                                intent: 'muted',
                                size: 'sm',
                              })} data-highlighted:bg-muted"
                              {label}
                              {value}
                            >
                              {#snippet children({ selected })}
                                {label}

                                {#if selected}
                                  <div class="ml-auto flex items-center">
                                    <span class="icon-[tabler--check]"
                                      >Selected</span
                                    >
                                  </div>
                                {/if}
                              {/snippet}
                            </Select.Item>
                          {/each}
                        </Select.Content>
                      </Select.Root>
                    {/snippet}
                  </Control>
                  <FieldErrors class="text-error" />
                {/snippet}
              </Field>

              <Field form={reportForm} name="message">
                {#snippet children({ constraints })}
                  <Control>
                    {#snippet children({ props })}
                      <Label class="{input.group()} max-h-none items-start!">
                        <span class="icon-[tabler--align-left] my-4"
                          >Message</span
                        >
                        <textarea
                          class="{input.field()} max-h-[50vh] min-h-14 py-4"
                          rows="10"
                          placeholder="Message"
                          {...props}
                          {...constraints}
                          bind:value={$formData.message}
                        ></textarea>
                      </Label>
                    {/snippet}
                  </Control>
                  <FieldErrors class="text-error" />
                {/snippet}
              </Field>

              <div class="flex items-center gap-2">
                <Button.Root class={button({ intent: 'error' })} type="submit">
                  <span class="icon-[tabler--flag]"></span>
                  Report
                  {#if $delayed}
                    <span
                      class="icon-[tabler--loader-2] animate-spin"
                      transition:fade={{ duration: 150 }}
                    ></span>
                  {/if}
                </Button.Root>
                <AlertDialog.Cancel
                  class={button({ kind: 'outline', intent: 'muted' })}
                >
                  <span class="icon-[tabler--x]"></span>
                  Cancel
                </AlertDialog.Cancel>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
