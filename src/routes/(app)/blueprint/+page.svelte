<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { BLUEPRINT_VIEW_SCHEMA } from '$lib/blueprint.schema';
  import { isBlueprintIdentifier } from '$lib/blueprint';
  import { add } from '$lib/client/toast.service';

  import * as Form from '$lib/components/ui/form';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Tooltip from '$lib/components/ui/tooltip';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zod(BLUEPRINT_VIEW_SCHEMA),
  });
  const { form: formData, enhance } = form;
</script>

<section class="mx-auto w-full max-w-5xl">
  <header class="mb-12 border-b border-base-content/20 px-4 pb-4">
    <hgroup>
      <h2 class="text-lg font-bold">
        <span class="icon-[tabler--schema] align-text-bottom text-2xl" />
        {data.seo.title}
      </h2>
      <p>
        {data.seo.description}
      </p>
    </hgroup>
  </header>

  <form
    class="space-y-4 px-4 lg:px-0"
    action="?/view"
    method="post"
    use:enhance
  >
    <Form.Field {form} name="identifier">
      <Form.Control let:attrs>
        <Form.Label>
          <span>Blueprint Identifier</span>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <span
                class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                The blueprint identifier needs to be <br />in the standard
                format of the game.
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Form.Label>
        <Textarea
          class="h-64 resize-none"
          placeholder="SHAPEZ-2 ... $"
          {...attrs}
          bind:value={$formData.identifier}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <label class="relative mt-4 block" for="blueprint-file">
      <input
        class="peer h-32 w-full cursor-pointer rounded-md border border-input bg-background outline-2 outline-offset-2 outline-ring transition-colors [text-indent:-9999rem] hover:bg-foreground focus-visible:outline"
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
        class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors peer-hover:text-background"
      >
        <span class="icon-[tabler--file-upload] size-8 align-middle" />
        <span>Blueprint file</span>
        <Tooltip.Root>
          <Tooltip.Trigger class="pointer-events-auto">
            <span
              class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>The content of the file will be added to the field above.</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </label>

    <Form.Button class="w-full">View</Form.Button>
  </form>
</section>

<section
  class="mx-auto mt-32 grid w-full max-w-5xl grid-cols-1 gap-8 px-10 md:grid-cols-2"
  id="more-features"
>
  <div class="indicator w-full">
    <span
      class="indicator-item indicator-start indicator-top flex h-12 w-12 items-center justify-center rounded-btn bg-secondary text-2xl text-secondary-content"
    >
      <span class="icon-[tabler--braces]" />
    </span>
    <div class="card card-bordered w-full bg-base-200">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Blueprint Codec</h2>
        <p>
          Decode or encode blueprints. <br /> Apply changes and make them your own!
        </p>
      </div>

      <a
        class="btn btn-secondary no-animation btn-block rounded-t-none"
        href="/blueprint/codec"
        title="Blueprint Codec"
      >
        Start
      </a>
    </div>
  </div>

  <div class="indicator w-full">
    <span
      class="indicator-item indicator-start indicator-top flex h-12 w-12 items-center justify-center rounded-btn bg-secondary p-2 text-2xl text-secondary-content"
    >
      <span class="icon-[tabler--refresh]" />
    </span>
    <div class="card card-bordered w-full bg-base-200">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Blueprint Converter</h2>
        <p>
          Convert existing blueprints <br />to a specific game version.
        </p>
      </div>

      <a
        class="btn btn-secondary no-animation btn-block rounded-t-none"
        href="/blueprint/convert"
        title="Blueprint Converter"
      >
        Start
      </a>
    </div>
  </div>
</section>
