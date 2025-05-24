<script lang="ts">
  import type { LayoutProps } from './$types';
  import { NavigationMenu } from 'bits-ui';
  import { page } from '$app/stores';
  import { capitalize } from '$lib/utils';

  import { button } from '$lib/components/button';
  import { section } from '$lib/components/section';
  import PageHeader from '$lib/components/PageHeader.svelte';

  let { data, children }: LayoutProps = $props();

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

    <NavigationMenu.Root>
      {#key $page.url}
        <NavigationMenu.List class="flex flex-col gap-2">
          {#each data.pages as page (page.path)}
            <NavigationMenu.Item>
              <NavigationMenu.Link
                class="{button({
                  kind: 'ghost',
                  intent: 'muted',
                  size: 'sm',
                })} {isCurrent(page.path) ? 'border-border text-foreground' : ''}"
                href={page.path}
                >{capitalize(page.name)}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/each}

          <NavigationMenu.Indicator>
            <div class="bg-primary"></div>
          </NavigationMenu.Indicator>
        </NavigationMenu.List>
      {/key}
    </NavigationMenu.Root>
  </aside>

  <div>
    {#if $page.data.seo}
      <PageHeader>
        <span class="icon-[tabler--settings] heading-2"></span>
        {$page.data.seo.title}
      </PageHeader>
    {/if}

    {@render children?.()}
  </div>
</section>
