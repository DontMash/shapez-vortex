<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from 'bits-ui';
  import {
    decode,
    encode,
    type Blueprint,
    type BlueprintIdentifier,
  } from '$lib/blueprint';
  import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.schema';
  import { copy, paste } from '$lib/client/actions/clipboard.svelte';
  import { add } from '$lib/client/toast.service';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data }: PageProps = $props();

  let blueprintImportIdentifier: BlueprintIdentifier | undefined = $state();
  const blueprintImportData: Blueprint | undefined = $derived(
    blueprintImportIdentifier ? decode(blueprintImportIdentifier) : undefined,
  );

  let blueprintField: string | undefined = $state();

  const blueprintExportData: Blueprint | undefined = $derived(
    blueprintField ? JSON.parse(blueprintField) : undefined,
  );
  const blueprintExportIdentifier: BlueprintIdentifier | undefined = $derived(
    blueprintExportData ? encode(blueprintExportData) : undefined,
  );

  $effect(() => {
    try {
      blueprintField = JSON.stringify(blueprintImportData, null, 4);
    } catch (err) {
      const error = err as Error;
      add({ type: 'ERROR', message: error.message });
    }
  });
</script>

<section class="{section()} space-y-4">
  <PageHeader>
    <span class="icon-[tabler--braces] heading-2"></span>
    {data.seo.title}

    {#snippet description()}
      This tool decodes any blueprint to a human-readable
      <Button.Root
        class={button({ kind: 'link' })}
        href="https://developer.mozilla.org/en-US/docs/Glossary/JSON"
        target="_blank"
        rel="noreferrer"
        >JSON-Object
      </Button.Root>. <br />
      It is also able to encode said object to a blueprint identifier, which can
      be used in the game.
    {/snippet}
  </PageHeader>

  <div class="bg-layer flex max-w-fit gap-2 rounded-md border p-2">
    <label
      class={button({ intent: 'accent', size: 'icon' })}
      for="blueprint-file"
    >
      <input
        class="hidden"
        type="file"
        id="blueprint-file"
        accept={BLUEPRINT_FILE_FORMAT}
        onchange={async (event) => {
          const target = event.currentTarget;
          if (!target.files) {
            return;
          }

          const file = [...target.files].at(0);
          if (!file) {
            return;
          }

          try {
            blueprintImportIdentifier =
              (await file.text()) as BlueprintIdentifier;
          } catch (err) {
            const error = err as Error;
            add({ type: 'ERROR', message: error.message });
          }
        }}
      />
      <span class="icon-[tabler--file-upload]">Import</span>
    </label>

    <button
      class={button({ intent: 'accent', size: 'icon' })}
      title="Paste blueprint"
      {@attach paste({
        onpaste: (value) => {
          blueprintImportIdentifier = value.trim() as BlueprintIdentifier;
          add({ message: 'Blueprint pasted.' });
        },
        onerror: (error) =>
          add({
            message: error.message,
            type: 'ERROR',
          }),
      })}
    >
      <span class="icon-[tabler--clipboard-text]">Paste</span>
    </button>

    {#if blueprintExportIdentifier}
      <form class="contents" action="/api/v1/blueprint/download">
        <input
          name="identifier"
          type="hidden"
          value={blueprintExportIdentifier}
          required
        />
        <button
          class={button({ kind: 'outline', intent: 'accent', size: 'icon' })}
          title="Download blueprint"
        >
          <span class="icon-[tabler--file-download]">Export</span>
        </button>
      </form>

      <button
        class={button({ kind: 'outline', intent: 'accent', size: 'icon' })}
        title="Copy blueprint"
        {@attach copy({
          value: blueprintExportIdentifier,
          oncopy: () => add({ message: 'Content copied' }),
          onerror: (error) =>
            add({
              message: error.message,
              type: 'ERROR',
            }),
        })}
      >
        <span class="icon-[tabler--copy]">Copy</span>
      </button>
    {/if}
  </div>

  <label class={input.group()} for="blueprint-content">
    <textarea
      class="{input.field()} min-h-14"
      id="blueprint-content"
      rows={16}
      bind:value={blueprintField}
    ></textarea>
  </label>
</section>
