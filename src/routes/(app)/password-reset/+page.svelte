<script lang="ts">
  import type { PageData } from './$types';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';
  import { PASSWORD_RESET_FORM_SCHEMA } from '$lib/user.types';
  import { button } from '$lib/components/button';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(PASSWORD_RESET_FORM_SCHEMA),
  });
  const { form: formData, enhance } = form;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--lock-access] heading-2" />
    {data.seo.title}
  </PageHeader>

  <div class="mx-auto max-w-screen-sm space-y-4 rounded-md border bg-layer p-4">
    <form
      class="flex flex-col gap-2"
      method="post"
      action="?/reset"
      use:enhance
    >
      <Field {form} name="email" let:constraints>
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--mail]">Email</span>
            <input
              class={input.field()}
              type="email"
              placeholder="Email"
              {...attrs}
              {...constraints}
              bind:value={$formData.email}
            />
          </Label>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <button class={button({ block: true })} title="Request a password reset">
        <span class="icon-[tabler--send-2]" />
        Request
      </button>
    </form>
  </div>
</section>
