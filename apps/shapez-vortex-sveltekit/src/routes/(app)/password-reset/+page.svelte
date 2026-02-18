<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { PASSWORD_RESET_FORM_SCHEMA } from '$lib/user.schema';

  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';
  import { button } from '$lib/components/button';

  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    validators: zodClient(PASSWORD_RESET_FORM_SCHEMA),
  });
  const { form: formData, enhance } = form;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--lock-access] heading-2"></span>
    {data.seo.title}
  </PageHeader>

  <div
    class="bg-layer mx-auto max-w-(--breakpoint-sm) space-y-4 rounded-md border p-4"
  >
    <form
      class="flex flex-col gap-2"
      method="post"
      action="?/reset"
      use:enhance
    >
      <Field {form} name="email">
        {#snippet children({ constraints })}
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--mail]">Email</span>
                <input
                  class={input.field()}
                  type="email"
                  placeholder="Email"
                  {...props}
                  {...constraints}
                  bind:value={$formData.email}
                />
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        {/snippet}
      </Field>

      <Button.Root
        class={button({ block: true })}
        title="Request a password reset"
      >
        <span class="icon-[tabler--send-2]"></span>
        Request
      </Button.Root>
    </form>
  </div>
</section>
