<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from 'bits-ui';
  import { Field, Control, Label, FieldErrors } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { USER_REGISTER_FORM_SCHEMA } from '$lib/user.types';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(USER_REGISTER_FORM_SCHEMA),
  });
  const { form: formData, enhance } = form;
  let isPasswordHidden = true;
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--edit] heading-2" />
    {data.seo.title}
  </PageHeader>

  <div class="mx-auto max-w-screen-sm space-y-4 rounded-md border bg-layer p-4">
    <form class="flex flex-col gap-2" action="?/register" method="post" use:enhance>
      <Field {form} name="username" let:constraints>
        <Control let:attrs>
          <div class={input.group()}>
            <span class="icon-[tabler--user]" />
            <Label class="sr-only">Username</Label>
            <input
              class={input.field()}
              type="text"
              placeholder="Username"
              {...attrs}
              {...constraints}
              bind:value={$formData.username}
            />
          </div>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <Field {form} name="displayname" let:constraints>
        <Control let:attrs>
          <div class={input.group()}>
            <span class="icon-[tabler--message-user]" />
            <Label class="sr-only">Displayname</Label>
            <input
              class={input.field()}
              type="text"
              placeholder="Displayname"
              {...attrs}
              {...constraints}
              bind:value={$formData.displayname}
            />
          </div>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <Field {form} name="email" let:constraints>
        <Control let:attrs>
          <div class={input.group()}>
            <span class="icon-[tabler--mail]" />
            <Label class="sr-only">email</Label>
            <input
              class={input.field()}
              type="email"
              placeholder="Email"
              {...attrs}
              {...constraints}
              bind:value={$formData.email}
            />
          </div>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <Field {form} name="password" let:constraints>
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--lock-password]" />
            <span class="sr-only">Password</span>
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
            <button
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              type="button"
              title={isPasswordHidden ? 'Show password' : 'Hide password'}
              on:click={() => (isPasswordHidden = !isPasswordHidden)}
            >
              <span class="sr-only">{isPasswordHidden ? 'Show' : 'Hide'}</span>
              {#if isPasswordHidden}
                <span class="icon-[tabler--eye-off] text-lg"
                  >Password is shown</span
                >
              {:else}
                <span class="icon-[tabler--eye] text-lg"
                  >Password is hidden</span
                >
              {/if}
            </button>
          </Label>
        </Control>
        <FieldErrors class="text-error" />
      </Field>

      <button class={button({ block: true })} title="Create your account">
        <span class="icon-[tabler--edit]" />
        Register
      </button>
    </form>

    <Button.Root class={button({ kind: 'link' })} href="/login">
      Already have an account?
    </Button.Root>
  </div>
</section>
