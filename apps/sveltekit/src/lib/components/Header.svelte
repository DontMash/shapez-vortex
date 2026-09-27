<script lang="ts">
  import { NavigationMenu, Separator } from 'bits-ui';
  import { cva } from 'class-variance-authority';
  import { page } from '$app/state';

  import { button } from '$lib/components/button';
  import { section } from '$lib/components/section';

  import Logo from '$lib/components/Logo.svelte';
  import Search from '$lib/components/Search.svelte';

  const menu = {
    item: cva([
      'flex',
      'items-center',
      'gap-2',
      'rounded-xs',
      'px-4',
      'py-1',
      'outline-hidden',
      'transition',
      'hover:bg-border',
      'focus-visible:bg-border',
      'data-highlighted:bg-border',
    ]),
  };

  let logoutFormElement: HTMLFormElement | undefined = $state();
</script>

<header
  class="{section({
    y: false,
  })} sticky inset-x-0 top-0 z-50 w-full py-4"
>
  <NavigationMenu.Root
    class="bg-layer/70 relative rounded-lg border p-4 shadow-lg backdrop-blur-lg"
  >
    <NavigationMenu.List class="flex items-center gap-4">
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <Logo />
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item class="ml-auto">
        <Search />
      </NavigationMenu.Item>

      <NavigationMenu.Item class="hidden sm:list-item">
        <NavigationMenu.Link
          class={button({ size: 'icon' })}
          href="/blueprint/upload"
          title="Upload a blueprint to Shapez Vortex"
        >
          <span class="icon-[tabler--upload]">Upload</span>
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      {#if !page.data.user}
        <NavigationMenu.Item>
          <NavigationMenu.Link
            class={button({ size: 'icon' })}
            title="Login into Shapez Vortex"
            href="/login"
          >
            <span class="icon-[tabler--login-2]">Login</span>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/if}

      {#if page.data.user}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
          >
            <span class="icon-[tabler--dots-vertical]">Show more options</span>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="flex flex-col gap-1">
            <NavigationMenu.Link
              class="{menu.item()} sm:hidden"
              href="/blueprint/upload"
            >
              <span class="icon-[tabler--upload] text-lg"></span>
              Upload
            </NavigationMenu.Link>

            <Separator.Root class="bg-border my-1 h-px sm:hidden" />

            <NavigationMenu.Link class={menu.item()} href="/user">
              <span class="icon-[tabler--user] text-lg"></span>
              Profile
            </NavigationMenu.Link>

            <NavigationMenu.Link class={menu.item()} href="/settings">
              <span class="icon-[tabler--settings] text-lg"></span>
              Settings
            </NavigationMenu.Link>

            <form
              class="contents"
              action="/logout"
              method="post"
              bind:this={logoutFormElement}
            >
              <button class={menu.item()}>
                <span class="icon-[tabler--logout-2] text-lg"></span>
                Logout
              </button>
            </form>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      {/if}
    </NavigationMenu.List>

    <NavigationMenu.Viewport
      class="bg-layer absolute top-[calc(100%+8px)] right-0 z-50 w-fit rounded-lg border p-2 shadow-lg backdrop-blur-lg before:absolute before:inset-x-0 before:-top-6 before:h-6"
    />
  </NavigationMenu.Root>
</header>
