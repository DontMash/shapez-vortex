<script lang="ts">
  import type { PageProps } from './$types';
  import { Button, Tooltip } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { isBlueprintIdentifier } from '$lib/blueprint';
  import { BLUEPRINT_VIEW_SCHEMA } from '$lib/blueprint.schema';
  import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';
  import { add } from '$lib/client/toast.service';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    validators: zod(BLUEPRINT_VIEW_SCHEMA),
  });
  const { form: formData, enhance } = form;

  type Tool = {
    icon: string;
    title: string;
    description: string;
    url: string;
    tooltip: string;
  };
  const tools: Array<Tool> = [
    {
      icon: 'icon-[tabler--braces]',
      title: 'Blueprint Codec',
      description:
        'Decode or encode your blueprints. Apply changes and make them your own!',
      url: '/blueprint/codec',
      tooltip: 'Start the blueprint codec',
    },
    {
      icon: 'icon-[tabler--refresh]',
      title: 'Blueprint Converter',
      description: 'Convert existing blueprints to a specific game version.',
      url: '/blueprint/convert',
      tooltip: 'Start the blueprint converter',
    },
  ];
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--schema] heading-2"></span>
    {data.seo.title}

    {#snippet description()}
      {data.seo.description}
    {/snippet}
  </PageHeader>

  <form class="flex flex-col gap-2" action="?/view" method="post" use:enhance>
    <label
      class="{input.group({ type: 'file' })} relative h-32"
      for="blueprint-file"
    >
      <input
        class="{input.field()} cursor-pointer indent-[-9999rem]"
        type="file"
        id="blueprint-file"
        accept={BLUEPRINT_FILE_FORMAT}
        multiple
        onchange={async (event) => {
          const input = event.currentTarget;
          const files = input.files;
          if (!files || files.length <= 0) return;

          const file = files.item(0);
          if (!file) return;

          const buffer = await file.arrayBuffer();
          const codec = new TextDecoder();
          const identifier = codec.decode(buffer);
          if (!isBlueprintIdentifier(identifier)) {
            return add({
              message: 'Invalid blueprint file',
              type: 'ERROR',
            });
          }

          $formData.identifier = identifier;

          input.files = null;
          add({
            message: 'Updated blueprint fields',
            type: 'SUCCESS',
          });
        }}
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <div>
          <span class="icon-[tabler--file-upload] size-8 align-middle"></span>
          <span>Blueprint file</span>
        </div>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger
              class="{button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })} absolute top-3 right-4"
            >
              <span class="icon-[tabler--info-circle]"></span>
            </Tooltip.Trigger>
            <Tooltip.Content
              class="bg-layer text-layer-foreground rounded-md border p-2"
            >
              <p>
                The content of the file will be pasted into the field below.
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </label>

    <Field {form} name="identifier">
      {#snippet children({ constraints })}
        <Control>
          {#snippet children({ props })}
            <Label class="{input.group()} max-h-none items-start!">
              <span class="icon-[tabler--braces] my-4"
                >Blueprint Identifier</span
              >
              <textarea
                class="{input.field()} min-h-14 py-4"
                rows={10}
                placeholder="Blueprint identifier"
                {...props}
                {...constraints}
                bind:value={$formData.identifier}
              ></textarea>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    class="{button({
                      kind: 'ghost',
                      intent: 'muted',
                      size: 'icon-sm',
                    })} my-3"
                  >
                    <span class="icon-[tabler--info-circle]"></span>
                  </Tooltip.Trigger>
                  <Tooltip.Content class="bg-layer rounded-md border p-2">
                    <p>
                      The blueprint identifier needs to be <br />
                      in the standard format of the game: <br />
                      <i>SHAPEZ-2 ... $</i>
                    </p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </Label>
          {/snippet}
        </Control>
        <FieldErrors class="text-error" />
      {/snippet}
    </Field>

    <Button.Root class={button({ block: true })}>View</Button.Root>
  </form>
</section>

<section class={section()} id="tools">
  <h2 class="heading-2 mb-2">Tools</h2>

  <div class="mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
    {#each tools as tool (tool.url)}
      <div class="bg-layer overflow-hidden rounded-md border shadow-md">
        <Button.Root href={tool.url} title={tool.tooltip}>
          <div class="flex aspect-[3/2] items-center justify-center">
            <span class="{tool.icon} text-[8rem]"></span>
          </div>
        </Button.Root>

        <div class="flex flex-col p-4 lg:h-56">
          <h3 class="heading-3">{tool.title}</h3>
          <p class="mt-2">
            {tool.description}
          </p>

          <Button.Root
            class="{button({
              intent: 'secondary',
              block: true,
            })} mt-8 lg:mt-auto"
            href={tool.url}
            title={tool.tooltip}
          >
            Start
            <span class="sr-only">{tool.title}</span>
          </Button.Root>
        </div>
      </div>
    {/each}
  </div>
</section>
