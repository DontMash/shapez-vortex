<script lang="ts">
  import type { LayoutData } from './$types';
  import { page } from '$app/stores';
  import { capitalize } from '$lib/utils';

  import { button } from '$lib/components/button';
  import { section } from '$lib/components/section';
  import PageHeader from '$lib/components/PageHeader.svelte';

  export let data: LayoutData;

  function isCurrent(path: string): boolean {
    return $page.url.pathname.includes(path);
  }
</script>

<section
  class="{section()} grid grid-cols-1 gap-8 md:grid-cols-[15rem_1fr] md:gap-4"
>
  <aside class="space-y-2">
    <p class="heading-3">
      @{data.user?.displayname}
    </p>

    <nav>
      {#key $page.url}
        <ul class="space-y-2">
          {#each data.pages as page}
            <li>
              <a
                class="{button({
                  kind: 'ghost',
                  intent: 'muted',
                  size: 'sm',
                })} {isCurrent(page.path) ? 'bg-muted text-foreground' : ''}"
                href={page.path}>{capitalize(page.name)}</a
              >
            </li>
          {/each}
        </ul>
      {/key}
    </nav>
  </aside>

  <div>
    {#if $page.data.seo}
      <PageHeader>
        <span class="icon-[tabler--settings] heading-2" />
        {$page.data.seo.title}
      </PageHeader>
    {/if}

    <slot />
  </div>
</section>
