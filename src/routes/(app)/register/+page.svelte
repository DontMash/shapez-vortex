<script lang="ts">
  import type { PageProps } from './$types';
  import { Button, Toggle } from 'bits-ui';
  import { Field, Control, Label, FieldErrors } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { USER_REGISTER_FORM_SCHEMA } from '$lib/user';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    validators: zodClient(USER_REGISTER_FORM_SCHEMA),
  });
  const { form: formData, enhance } = form;
  let isPasswordHidden = $state(true);
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--edit] heading-2"></span>
    {data.seo.title}
  </PageHeader>

  <div
    class="bg-layer mx-auto max-w-(--breakpoint-sm) space-y-4 rounded-md border p-4"
  >
    <form
      class="flex flex-col gap-2"
      action="?/register"
      method="post"
      use:enhance
    >
      <Field {form} name="username">
        {#snippet children({ constraints })}
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--user]">Username</span>
                <input
                  class={input.field()}
                  type="text"
                  placeholder="Username"
                  {...props}
                  {...constraints}
                  bind:value={$formData.username}
                />
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        {/snippet}
      </Field>

      <Field {form} name="displayname">
        {#snippet children({ constraints })}
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--message-user]">Displayname</span>
                <input
                  class={input.field()}
                  type="text"
                  placeholder="Displayname"
                  {...props}
                  {...constraints}
                  bind:value={$formData.displayname}
                />
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        {/snippet}
      </Field>

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

      <Field {form} name="password">
        {#snippet children({ constraints })}
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--lock-password]">Password</span>
                <input
                  class={input.field()}
                  type={isPasswordHidden ? 'password' : 'text'}
                  placeholder="Password"
                  {...props}
                  {...constraints}
                  value={$formData.password}
                  oninput={(event) => {
                    $formData.password = event.currentTarget.value;
                  }}
                />
                <Toggle.Root
                  class={button({
                    kind: 'ghost',
                    intent: 'muted',
                    size: 'icon-sm',
                  })}
                  title={isPasswordHidden ? 'Show password' : 'Hide password'}
                  bind:pressed={isPasswordHidden}
                >
                  {#if isPasswordHidden}
                    <span class="icon-[tabler--eye-off] text-lg"
                      >Password is shown</span
                    >
                  {:else}
                    <span class="icon-[tabler--eye] text-lg"
                      >Password is hidden</span
                    >
                  {/if}
                </Toggle.Root>
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        {/snippet}
      </Field>

      <Button.Root class={button({ block: true })} title="Create your account">
        <span class="icon-[tabler--edit]"></span>
        Register
      </Button.Root>
    </form>

    <Button.Root class={button({ kind: 'link' })} href="/login">
      Already have an account?
    </Button.Root>
  </div>
</section>
