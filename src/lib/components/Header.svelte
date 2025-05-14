<script lang="ts">
  import { Button, Menubar } from 'bits-ui';
  import { cva } from 'class-variance-authority';
  import { blur } from 'svelte/transition';
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
      'outline-none',
      'transition',
      'hover:bg-border',
      'focus-visible:bg-border',
      'data-[highlighted]:bg-border',
    ]),
  };

  let logoutFormElement: HTMLFormElement | undefined = $state();
</script>

<header
  class="{section({
    y: false,
  })} sticky inset-x-0 top-0 z-50 w-full py-4"
>
  <nav
    class="flex items-center rounded-lg border bg-layer/70 p-4 shadow-lg backdrop-blur-lg"
    aria-label="Main"
  >
    <Logo />

    <div class="ml-auto flex items-center gap-4">
      <Search />

      <Button.Root
        class="{button({ size: 'icon' })} hidden sm:inline-flex"
        href="/blueprint/upload"
        title="Upload a blueprint to Shapez Vortex"
      >
        <span class="icon-[tabler--upload]">Upload</span>
      </Button.Root>

      {#if !page.data.user}
        <Button.Root
          class={button({ size: 'icon' })}
          title="Login into Shapez Vortex"
          href="/login"
        >
          <span class="icon-[tabler--login-2]">Login</span>
        </Button.Root>
      {/if}

      {#if page.data.user}
        <Menubar.Root>
          <Menubar.Menu>
            <Menubar.Trigger
              class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
            >
              <span class="icon-[tabler--dots-vertical]">Show more options</span
              >
            </Menubar.Trigger>

            <Menubar.Content
              side="bottom"
              sideOffset={24}
              align="end"
              alignOffset={-16}
              strategy="fixed"
              forceMount
            >
              {#snippet child({ wrapperProps, props, open })}
                {#if open}
                  <div {...wrapperProps}>
                    <div
                      class="z-20 flex flex-col gap-1 rounded-lg border bg-layer/70 p-2 shadow-lg outline-none backdrop-blur-lg"
                      {...props}
                      transition:blur={{ duration: 150 }}
                    >
                      <Menubar.Item>
                        {#snippet child({ props })}
                          <a
                            class="{menu.item()} sm:hidden"
                            href="/blueprint/upload"
                            title="Upload a blueprint to Shapez Vortex"
                            {...props}
                          >
                            <span class="icon-[tabler--upload] text-lg"></span>
                            Upload
                          </a>
                        {/snippet}
                      </Menubar.Item>

                      <Menubar.Separator
                        class="my-1 h-px bg-border sm:hidden"
                      />

                      <Menubar.Item>
                        {#snippet child({ props })}
                          <a class={menu.item()} href="/user" {...props}>
                            <span class="icon-[tabler--user] text-lg"></span>
                            Profile
                          </a>
                        {/snippet}
                      </Menubar.Item>
                      <Menubar.Item>
                        {#snippet child({ props })}
                          <a class={menu.item()} href="/settings" {...props}>
                            <span class="icon-[tabler--settings] text-lg"
                            ></span>
                            Settings
                          </a>
                        {/snippet}
                      </Menubar.Item>
                      <Menubar.Item>
                        {#snippet child({ props })}
                          <form
                            class="contents"
                            action="/logout"
                            method="post"
                            bind:this={logoutFormElement}
                          >
                            <button class={menu.item()} {...props}>
                              <span class="icon-[tabler--logout-2] text-lg"
                              ></span>
                              Logout
                            </button>
                          </form>
                        {/snippet}
                      </Menubar.Item>
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
      {/if}
    </div>
  </nav>
</header>
