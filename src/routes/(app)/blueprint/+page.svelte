<script lang="ts">
  import type { PageData } from './$types';
  import { blur } from 'svelte/transition';
  import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { BLUEPRINT_VIEW_SCHEMA } from '$lib/blueprint.schema';
  import { isBlueprintIdentifier } from '$lib/blueprint';
  import { add } from '$lib/client/toast.service';

  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { Button, Tooltip } from 'bits-ui';
  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';

  export let data: PageData;

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
    <span class="icon-[tabler--schema] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      {data.seo.description}
    </svelte:fragment>
  </PageHeader>

  <form class="flex flex-col gap-2" action="?/view" method="post" use:enhance>
    <label class="relative" for="blueprint-file">
      <input
        class="{button({
          kind: 'outline',
          intent: 'muted',
          block: true,
        })} peer h-32 cursor-pointer [text-indent:-9999rem]"
        type="file"
        id="blueprint-file"
        accept={BLUEPRINT_FILE_FORMAT}
        multiple
        on:change={async (event) => {
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
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center transition"
      >
        <span class="icon-[tabler--file-upload] text-3xl" />
        <span>Blueprint file</span>
      </div>
      <Tooltip.Root>
        <Tooltip.Trigger
          class="{button({
            kind: 'ghost',
            intent: 'muted',
            size: 'icon-sm',
          })} absolute right-2 top-2"
        >
          <span class="icon-[tabler--info-circle]" />
        </Tooltip.Trigger>
        <Tooltip.Content
          class="rounded-sm border bg-layer/70 p-2 shadow-lg backdrop-blur-lg"
          transition={blur}
          transitionConfig={{ duration: 150 }}
          sideOffset={8}
        >
          <p>The content of the file will be pasted into the field below.</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </label>

    <Field {form} name="identifier" let:constraints>
      <Control let:attrs>
        <Label
          class="{input.group()} relative inline-grid overflow-y-auto whitespace-pre-wrap break-all after:invisible after:col-start-1 after:row-start-1 after:py-2 after:content-[attr(data-value)]"
        >
          <span class="sr-only">Blueprint Identifier</span>
          <textarea
            class="{input.field()} col-start-1 row-start-1 min-w-64 resize-none overflow-hidden py-2"
            placeholder="Blueprint identifier"
            rows={6}
            {...attrs}
            {...constraints}
            oninput="this.parentNode.dataset.value = this.value"
            onfocus="this.parentNode.dataset.value = this.value"
            bind:value={$formData.identifier}
          ></textarea>
          <Tooltip.Root>
            <Tooltip.Trigger
              class="{button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })} absolute right-2 top-2"
            >
              <span class="icon-[tabler--info-circle]" />
            </Tooltip.Trigger>
            <Tooltip.Content
              class="rounded-sm border bg-layer/70 p-2 shadow-lg backdrop-blur-lg"
              transition={blur}
              transitionConfig={{ duration: 150 }}
              sideOffset={8}
            >
              <p>
                The blueprint identifier needs to be <br />in the standard
                format of the game.
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Label>
      </Control>
      <FieldErrors class="text-error" />
    </Field>

    <Button.Root class={button({ block: true })}>View</Button.Root>
  </form>
</section>

<section class={section()} id="tools">
  <h2 class="heading-2 mb-2">Tools</h2>

  <div class="mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
    {#each tools as tool}
      <div class="overflow-hidden rounded-md border bg-layer shadow-md">
        <Button.Root
          class="aspect-h-2 aspect-w-3 block"
          href={tool.url}
          title={tool.tooltip}
        >
          <div class="flex items-center justify-center">
            <span class="{tool.icon} text-[8rem]" />
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
