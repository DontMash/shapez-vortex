<script lang="ts">
  import type { PageProps } from './$types';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm } from 'sveltekit-superforms';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';

  let { data }: PageProps = $props();

  const form = superForm(data.form);
  const { form: formData, enhance } = form;
</script>

<section class="mx-auto w-full max-w-5xl space-y-4">
  {#if data.user && data.user.verified}
    <form action="/password-reset/?/reset" method="post">
      <input type="hidden" name="email" value={data.user.email} />
      <button class={button({ kind: 'outline', block: true })}>
        <span class="icon-[tabler--lock-question]"></span>
        Request password reset
      </button>
    </form>
  {:else}
    <form action="?/verification" method="post">
      <button class={button({ kind: 'outline', block: true })}>
        <span class="icon-[tabler--user-question]"></span>
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
    <Field {form} name="email">
      {#snippet children({ constraints })}
        <div class="flex flex-1 flex-col gap-2">
          <Control>
            {#snippet children({ props })}
              <Label class={input.group()}>
                <span class="icon-[tabler--mail]">Email</span>
                <input
                  class={input.field()}
                  type="text"
                  placeholder="Email"
                  {...props}
                  {...constraints}
                  bind:value={$formData.email}
                />
              </Label>
            {/snippet}
          </Control>
          <FieldErrors class="text-error" />
        </div>
      {/snippet}
    </Field>

    <button class={button()}>
      <span class="icon-[tabler--refresh]"></span>
      Update
    </button>
  </form>
</section>
