<script lang="ts">
  import type { PageData } from './$types';
  import { Button, Toggle } from 'bits-ui';
  import { Field, Control, Label, FieldErrors } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { page } from '$app/stores';
  import { add } from '$lib/client/toast.service';
  import { USER_LOGIN_FORM_SCHEMA } from '$lib/user.types';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(USER_LOGIN_FORM_SCHEMA),
    onError({ result }) {
      add({ message: result.error.message, type: 'ERROR' });
    },
  });
  const { form: formData, enhance } = form;
  let isPasswordHidden = true;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--login-2] heading-2" />
    {data.seo.title}
  </PageHeader>

  <div class="mx-auto max-w-screen-sm space-y-4 rounded-md border bg-layer p-4">
    <form
      class="flex flex-col gap-2"
      method="post"
      action="?/login"
      use:enhance
    >
      {#if $page}
        {@const redirect = $page.url.searchParams.get('redirect')}
        {#if redirect}
          <input type="hidden" name="redirect" value={redirect} />
        {/if}
      {/if}

      <Field {form} name="username" let:constraints>
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--user]">Username</span>
            <input
              class={input.field()}
              type="text"
              placeholder="Username"
              {...attrs}
              {...constraints}
              bind:value={$formData.username}
            />
          </Label>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <Field {form} name="password" let:constraints>
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--lock-password]">Password</span>
            <input
              class={input.field()}
              type={isPasswordHidden ? 'password' : 'text'}
              placeholder="Password"
              {...attrs}
              {...constraints}
              value={$formData.password}
              on:input={(event) => {
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
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <Button.Root
        class={button({ block: true })}
        title="Login to your account"
      >
        <span class="icon-[tabler--login-2]" />
        Login
      </Button.Root>
    </form>

    <div class="flex justify-between gap-4">
      <Button.Root class={button({ kind: 'link' })} href="/register">
        Create an account?
      </Button.Root>
      <Button.Root
        class="{button({ kind: 'link' })} text-right"
        href="/password-reset"
      >
        Forgot your password?
      </Button.Root>
    </div>
  </div>
</section>
