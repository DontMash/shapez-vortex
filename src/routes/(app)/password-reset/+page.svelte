<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
  <header
    class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
  >
    <hgroup>
      <h2 class="text-lg font-bold">
        <span class="icon-[tabler--lock-access] align-text-bottom text-2xl" />
        {data.seo.title}
      </h2>
    </hgroup>
  </header>

  <div
    class="card card-bordered mx-auto max-w-screen-sm rounded-none border-x-0 border-base-content/20 bg-base-200 shadow-lg transition-[border-radius] sm:rounded-box sm:border-x"
  >
    <form class="card-body" method="post" action="?/reset">
      <label class="form-control" for="email">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <div class="input input-bordered flex items-center space-x-2">
          <span class="icon-[tabler--mail] align-text-bottom text-2xl" />
          <input
            class="w-full"
            type="email"
            name="email"
            id="email"
            value={$page.form && !$page.form.success
              ? $page.form.data.email
              : null}
            required
          />
        </div>
      </label>

      {#if $page.form && !$page.form.success && $page.form.issues}
        <ul class="inline-block font-medium italic text-error">
          {#each $page.form.issues as issue}
            <li>
              {issue.message}
            </li>
          {/each}
        </ul>
      {/if}

      <button class="btn btn-primary mt-4">
        <span class="icon-[tabler--send-2] text-2xl" />
        Request
      </button>
    </form>
  </div>
</section>
