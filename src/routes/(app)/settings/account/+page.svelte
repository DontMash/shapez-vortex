<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';

  export let data: PageData;

  const form = superForm(data.form);
  const { form: formData, enhance } = form;
</script>

<section class="mx-auto w-full max-w-5xl space-y-4">
  {#if data.user && data.user.verified}
    <form action="/password-reset/?/reset" method="post">
      <input type="hidden" name="email" value={data.user.email} />
      <button class={button({ kind: 'outline', block: true })}>
        <span class="icon-[tabler--lock-question]" />
        Request password reset
      </button>
    </form>
  {:else}
    <form action="?/verification" method="post">
      <button class={button({ kind: 'outline', block: true })}>
        <span class="icon-[tabler--user-question]" />
        Request verification
      </button>
    </form>
  {/if}

  <form
    class="flex items-start gap-2"
    action="?/email"
    method="post"
    use:enhance
  >
    <Field {form} name="email" let:constraints>
      <div class="flex flex-1 flex-col gap-2">
        <Control let:attrs>
          <Label class={input.group()}>
            <span class="icon-[tabler--mail]">Email</span>
            <input
              class={input.field()}
              type="text"
              placeholder="Email"
              {...attrs}
              {...constraints}
              bind:value={$formData.email}
            />
          </Label>
        </Control>
        <FieldErrors class="text-error" />
      </div>
    </Field>

    <button class={button()}>
      <span class="icon-[tabler--refresh]" />
      Update
    </button>
  </form>

  {#if $page.form && !$page.form.success && $page.form.issues}
    <ul class="inline-block font-medium italic text-error">
      {#each $page.form.issues as issue}
        <li>
          {issue.message}
        </li>
      {/each}
    </ul>
  {/if}
</section>
