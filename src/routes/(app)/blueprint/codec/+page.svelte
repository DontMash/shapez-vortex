<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { page } from '$app/stores';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;

  const decodeForm = superForm(data.decodeForm, {
    resetForm: true,
  });
  const {
    form: decodeFormData,
    enhance: decodeEnhance,
    message: decodeMessage,
  } = decodeForm;

  const encodeForm = superForm(data.encodeForm, {
    resetForm: true,
  });
  const {
    form: encodeFormData,
    enhance: encodeEnhance,
    message: encodeMessage,
  } = encodeForm;

  $: {
    $encodeFormData.data = JSON.stringify($decodeMessage, null, 4);
    $decodeFormData.identifier = $encodeMessage
  }
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--braces] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      This tool decodes any blueprint to a human-readable
      <Button.Root
        class={button({ kind: 'link' })}
        href="https://developer.mozilla.org/en-US/docs/Glossary/JSON"
        target="_blank"
        rel="noreferrer">JSON-Object</Button.Root
      >. <br />
      It is also able to encode said object to a blueprint identifier which can be
      used in the game.
    </svelte:fragment>
  </PageHeader>

  <form
    class="flex flex-col gap-2"
    method="post"
    action="?/decode"
    use:decodeEnhance
  >
    <Field form={decodeForm} name="identifier" let:constraints>
      <Control let:attrs>
        <Label
          class="{input.group()} relative inline-grid overflow-y-auto whitespace-pre-wrap break-all after:invisible after:col-start-1 after:row-start-1 after:py-2 after:content-[attr(data-value)]"
        >
          <span class="sr-only">Blueprint identifier</span>
          <textarea
            class="{input.field()} col-start-1 row-start-1 min-w-64 resize-none overflow-hidden py-2"
            placeholder="Blueprint identifier"
            rows={5}
            {...attrs}
            {...constraints}
            oninput="this.parentNode.dataset.value = this.value"
            onfocus="this.parentNode.dataset.value = this.value"
            bind:value={$decodeFormData.identifier}
          ></textarea>
        </Label>
      </Control>
      <FieldErrors class="text-error" />
    </Field>

    <Button.Root class={button()}>
      <span class="icon-[tabler--code-dots]" />
      Decode
    </Button.Root>
  </form>

  <form
    class="mt-4 flex flex-col gap-2"
    method="post"
    action="?/encode"
    use:encodeEnhance
  >
    <Button.Root class={button({ intent: 'accent' })}>
      <span class="icon-[tabler--code-minus]" />
      Encode</Button.Root
    >

    <Field form={encodeForm} name="data" let:constraints>
      <Control let:attrs>
        <Label
          class="{input.group()} relative inline-grid overflow-y-auto whitespace-pre-wrap break-all after:invisible after:col-start-1 after:row-start-1 after:py-2 after:content-[attr(data-value)]"
        >
          <span class="sr-only">Blueprint data</span>
          <textarea
            class="{input.field()} col-start-1 row-start-1 min-w-64 resize-none overflow-hidden py-2"
            placeholder="Blueprint data"
            rows={5}
            {...attrs}
            {...constraints}
            oninput="this.parentNode.dataset.value = this.value"
            onfocus="this.parentNode.dataset.value = this.value"
            bind:value={$encodeFormData.data}
          ></textarea>
        </Label>
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </form>
</section>
