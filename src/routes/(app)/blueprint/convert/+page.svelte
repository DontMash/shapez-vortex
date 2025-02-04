<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import CopyButton from '$lib/components/CopyButton.svelte';
  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;

  const form = superForm(data.form, {
    resetForm: true,
  });
  const { form: formData, enhance, message } = form;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--refresh] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      This tool modifies any blueprint to work in the current version of the
      game. <br />
      <i class="small">
        No guarantee for older blueprints to work in newer versions of the game!
      </i>
    </svelte:fragment>
  </PageHeader>

  <form class="flex flex-col gap-2" method="post" action="?/update" use:enhance>
    <Field {form} name="version" let:constraints>
      <Control let:attrs>
        <Label class={input.group()}>
          <span class="icon-[tabler--square-rounded-letter-v]"
            >Game version</span
          >
          <input
            class={input.field()}
            type="text"
            inputmode="numeric"
            placeholder="Game version"
            {...attrs}
            {...constraints}
            bind:value={$formData.version}
          />
        </Label>
      </Control>
      <FieldErrors class="text-error" />
    </Field>

    <Field {form} name="identifier" let:constraints>
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
            bind:value={$formData.identifier}
          ></textarea>
        </Label>
      </Control>
      <FieldErrors class="text-error" />
    </Field>

    <Button.Root class={button()}>
      <span class="icon-[tabler--arrow-big-up-line]" />
      Update
    </Button.Root>
  </form>
</section>

{#if $message}
  <section class={section()}>
    <h2 class="heading-3 mb-2">Updated blueprint:</h2>
    <p class="h-80 overflow-y-auto break-words rounded-md border p-4 px-4">
      <span class="float-right">
        <CopyButton value={$message} />
      </span>
      {$message}
    </p>
  </section>
{/if}
