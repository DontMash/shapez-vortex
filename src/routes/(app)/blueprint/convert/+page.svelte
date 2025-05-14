<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  import CopyButton from '$lib/components/CopyButton.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    resetForm: true,
  });
  const { form: formData, enhance, message } = form;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--refresh] heading-2"></span>
    {data.seo.title}

    {#snippet description()}
      This tool modifies any blueprint to work in the current version of the
      game. <br />
      <i class="small">
        No guarantee for older blueprints to work in newer versions of the game!
      </i>
    {/snippet}
  </PageHeader>

  <form class="flex flex-col gap-2" method="post" action="?/update" use:enhance>
    <Field {form} name="version">
      {#snippet children({ constraints })}
        <Control>
          {#snippet children({ props })}
            <Label class={input.group()}>
              <span class="icon-[tabler--square-rounded-letter-v]"
                >Game version</span
              >
              <input
                class={input.field()}
                type="text"
                inputmode="numeric"
                placeholder="Game version"
                {...props}
                {...constraints}
                bind:value={$formData.version}
              />
            </Label>
          {/snippet}
        </Control>
        <FieldErrors class="text-error" />
      {/snippet}
    </Field>

    <Field {form} name="identifier">
      {#snippet children({ constraints })}
        <Control>
          {#snippet children({ props })}
            <Label class={input.group()}>
              <span class="sr-only">Blueprint identifier</span>
              <textarea
                class="{input.field()} min-h-14 min-w-64 py-4"
                placeholder="Blueprint identifier"
                rows={5}
                {...props}
                {...constraints}
                bind:value={$formData.identifier}
              ></textarea>
            </Label>
          {/snippet}
        </Control>
        <FieldErrors class="text-error" />
      {/snippet}
    </Field>

    <Button.Root class={button()}>
      <span class="icon-[tabler--arrow-big-up-line]"></span>
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
