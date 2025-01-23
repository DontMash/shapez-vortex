<script lang="ts">
  import { Button, Menubar } from 'bits-ui';
  import { blur } from 'svelte/transition';
  import { page } from '$app/stores';
  import { button } from '$lib/components/button';
  import { section } from '$lib/components/section';
  import Logo from '$lib/components/Logo.svelte';
  import Search from '$lib/components/Search.svelte';
</script>

<header
  class="{section({
    y: false,
  })} sticky inset-x-0 top-0 z-10 w-full py-4"
>
  <nav
    class="flex items-center rounded-lg border bg-layer/70 p-4 shadow-lg backdrop-blur-lg"
  >
    <Logo />

    <div class="ml-auto flex items-center gap-4">
      <Search />

      <Button.Root
        class="{button({ type: 'icon' })} hidden sm:inline-flex"
        href="/blueprint/upload"
        title="Upload a blueprint to Shapez Vortex"
      >
        <span class="icon-[tabler--upload]">Upload</span>
      </Button.Root>

      {#if !$page.data.user}
        <Button.Root
          class={button()}
          title="Login into Shapez Vortex"
          href="/login"
        >
          <span class="icon-[tabler--login-2]">Login</span>
        </Button.Root>
      {/if}

      {#if $page.data.user}
        <Menubar.Root>
          <Menubar.Menu loop>
            <Menubar.Trigger class={button({ type: 'icon', kind: 'outline' })}>
              <span class="icon-[tabler--user]">User</span>
            </Menubar.Trigger>

            <Menubar.Content
              class="z-20 space-y-1 rounded-lg border bg-layer/70 p-2 outline-none backdrop-blur-lg"
              transition={blur}
              transitionConfig={{ duration: 150 }}
              side="bottom"
              sideOffset={24}
              align="end"
              alignOffset={16}
              strategy="fixed"
            >
              <Menubar.Item
                class="flex items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
                href="/user"
                title="Go to your user profile"
              >
                <span class="icon-[tabler--user] text-lg" />
                Profile
              </Menubar.Item>
              <Menubar.Item
                class="flex items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
                href="/settings"
                title="Go to your user settings"
              >
                <span class="icon-[tabler--settings] text-lg" />
                Settings
              </Menubar.Item>
              <Menubar.Item asChild let:builder>
                <form action="/logout" method="post">
                  <button
                    class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
                    title="Logout"
                    use:builder.action
                    {...builder}
                  >
                    <span class="icon-[tabler--logout-2] text-lg" />
                    Logout</button
                  >
                </form>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
      {/if}
    </div>
  </nav>
</header>
