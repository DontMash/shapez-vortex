<script lang="ts">
  import { Button, Dialog, Menubar } from 'bits-ui';
  import { Command } from 'cmdk-sv';
  import { blur, fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isShapeIdentifier } from '$lib/shape.types';
  import { section } from '$lib/components/section';
  import { button } from '$lib/components/button';

  import logo from '$lib/assets/images/logo.png';

  const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
  $: os = $page.data.agent?.os;

  let isSearchDialogOpen = false;
  let searchValue = '';
  let searchInputElement: HTMLInputElement | undefined;

  $: {
    searchInputElement?.focus();
  }

  function searchBlueprints(search: string) {
    const url = new URL('/blueprint/search', $page.url.origin);
    url.searchParams.append('query', search);
    goto(url.href);
  }
  function command(callback: () => void) {
    isSearchDialogOpen = false;
    callback();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!os || !os.name) return;

    switch (event.key) {
      case 'k':
        if (
          (os.name === OPERATING_SYSTEMS[0] && event.metaKey) ||
          ((os.name === OPERATING_SYSTEMS[1] ||
            os.name === OPERATING_SYSTEMS[2]) &&
            event.ctrlKey)
        ) {
          event.preventDefault();
          isSearchDialogOpen = true;
        }
        break;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<header class="sticky left-0 top-0 z-10 w-full p-4">
  <nav
    class="{section({
      x: false,
      y: false,
    })} bg-layer/70 flex items-center rounded-lg border p-4 shadow-lg backdrop-blur-lg"
  >
    <Button.Root
      class={button({ type: 'icon', kind: 'ghost' })}
      href="/"
      title="To the frontpage"
    >
      <img
        class="inline-block"
        src={logo}
        alt="Shapez Vortex Logo"
        width="48"
        height="48"
      />
      <span class="sr-only">Shapez Vortex</span>
    </Button.Root>

    <div class="ml-auto flex items-center gap-4">
      <Dialog.Root
        bind:open={isSearchDialogOpen}
        onOpenChange={() => {
          searchValue = '';
        }}
      >
        <Dialog.Trigger
          class={button({ kind: 'outline' })}
          title="Search the Shapez Vortex"
        >
          <span class="icon-[tabler--search]" />
          Search
          {#if os && os.name && OPERATING_SYSTEMS.find((value) => value === os?.name)}
            <span class=" hidden sm:block">
              {#if os.name === OPERATING_SYSTEMS[0]}
                <kbd
                  class="rounded-xs inline-flex size-6 items-center justify-center border bg-background"
                  >⌘</kbd
                >
              {/if}
              {#if os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]}
                <kbd
                  class="rounded-xs inline-flex size-6 items-center justify-center border bg-background"
                  >Ctrl</kbd
                >
              {/if}
              <kbd
                class="rounded-xs inline-flex size-6 items-center justify-center border bg-background"
                >K</kbd
              >
            </span>
          {/if}
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            class="fixed inset-0 z-50 bg-background/70 backdrop-blur-lg"
            transition={blur}
            transitionConfig={{ duration: 150 }}
          />

          <Dialog.Content
            class="bg-layer fixed left-1/2 top-4 z-50 min-h-64 w-[theme(screens.sm)] max-w-[calc(100%-theme(spacing.4))] -translate-x-1/2 rounded-lg border outline-none"
            transition={fade}
            transitionConfig={{ duration: 150 }}
          >
            <Dialog.Title class="sr-only" level="h2"
              >Search the Shapez Vortex</Dialog.Title
            >
            <Dialog.Description class="sr-only"
              >This dialog allows you to search all the content of the Shapez
              Vortex community-platform.</Dialog.Description
            >
            <Dialog.Close
              class="{button({
                type: 'icon',
                kind: 'outline',
                size: 'sm',
              })} absolute right-4 top-4 size-8 rounded-full border"
            >
              <span class="icon-[tabler--x] text-lg">Close search dialog</span>
            </Dialog.Close>

            <Command.Root label="Search" loop>
              <div class="flex items-center gap-2 border-b py-4 pl-4 pr-16">
                <span class="icon-[tabler--search]" />
                <Command.Input
                  class="h-8 w-full bg-transparent outline-none placeholder:text-muted"
                  placeholder="Search the vortex..."
                  bind:el={searchInputElement}
                  bind:value={searchValue}
                />
              </div>

              <Command.List
                class="px-1 py-4 [&_[data-cmdk-group]+[data-cmdk-group]]:mt-4"
              >
                <Command.Empty class="text-center"
                  >No results found.</Command.Empty
                >

                {#if searchValue}
                  {@const blueprints = $page.data.searchBlueprints}
                  {#if blueprints.length > 0}
                    <Command.Group
                      class="[&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-sm [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
                      heading="Blueprints"
                      alwaysRender
                    >
                      {#each blueprints as blueprint}
                        <Command.Item
                          class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                          id={blueprint.id}
                          value={blueprint.title}
                          onSelect={() =>
                            command(() => goto(`/blueprint/${blueprint.id}`))}
                        >
                          <span class="icon-[tabler--schema]" />
                          <span
                            class="overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {blueprint.title}
                          </span>
                          {#if blueprint.expand && blueprint.expand['creator']}
                            <span
                              class="rounded-xs bg-accent px-1 py-0.5 text-sm ml-auto text-accent-foreground"
                            >
                              @{blueprint.expand['creator'].displayname}
                            </span>
                          {/if}
                        </Command.Item>
                      {/each}
                      <Command.Item
                        class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                        alwaysRender
                        onSelect={() =>
                          command(() => searchBlueprints(searchValue))}
                      >
                        <span class="icon-[tabler--search]" />
                        Show more...
                      </Command.Item>
                    </Command.Group>
                  {/if}

                  {@const users = $page.data.searchUsers}
                  {#if users.length > 0}
                    <Command.Group
                      class="[&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-sm [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
                      heading="Users"
                    >
                      {#each users as user}
                        <Command.Item
                          class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                          onSelect={() =>
                            command(() => goto(`/user/@${user.displayname}`))}
                        >
                          <span class="icon-[tabler--user]" />
                          {user.displayname}
                        </Command.Item>
                      {/each}
                    </Command.Group>
                  {/if}
                {/if}

                <Command.Group
                  class="[&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-sm [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
                  heading="Features"
                >
                  {#if isShapeIdentifier(searchValue)}
                    <Command.Item
                      class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                      onSelect={() =>
                        command(() => goto(`/shape?identifier=${searchValue}`))}
                    >
                      <span class="icon-[tabler--stack]" />
                      View Shape - {searchValue}
                    </Command.Item>
                  {:else}
                    <Command.Item
                      class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                      onSelect={() => command(() => goto('/shape'))}
                    >
                      <span class="icon-[tabler--stack]" />
                      Shape Viewer
                    </Command.Item>
                  {/if}
                  <Command.Item
                    class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                    onSelect={() => command(() => goto('/blueprint'))}
                  >
                    <span class="icon-[tabler--schema]" />
                    Blueprint Viewer
                  </Command.Item>

                  {#if $page.data.user}
                    {#if $page.data.user.verified}
                      <Command.Item
                        class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                        onSelect={() =>
                          command(() => goto('/blueprint/upload'))}
                      >
                        <span class="icon-[tabler--upload]" />
                        Upload
                      </Command.Item>
                    {/if}
                    <Command.Item
                      class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                      onSelect={() => command(() => goto('/user'))}
                    >
                      <span class="icon-[tabler--user]" />
                      Profile
                    </Command.Item>
                    <Command.Item
                      class="rounded-xs flex cursor-pointer items-center gap-2 px-3 py-2 transition aria-selected:bg-border"
                      onSelect={() => command(() => goto('/settings'))}
                    >
                      <span class="icon-[tabler--settings]" />
                      Settings
                    </Command.Item>
                  {/if}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Button.Root
        class={button({ type: 'icon' })}
        href="/blueprint/upload"
        title="Upload a blueprint to Shapez Vortex"
      >
        <span class="icon-[tabler--upload]">Upload</span>
      </Button.Root>

      {#if !$page.data.user}
        <Button.Root
          class={button({ type: 'icon' })}
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
              class="bg-layer/70 z-20 space-y-1 rounded-lg border p-2 outline-none backdrop-blur-lg"
              transition={blur}
              transitionConfig={{ duration: 150 }}
              side="bottom"
              sideOffset={24}
              align="end"
              alignOffset={16}
              strategy="fixed"
            >
              <Menubar.Item
                class="rounded-xs flex items-center gap-2 px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
                href="/user"
                title="Go to your user profile"
              >
                <span class="icon-[tabler--user] text-lg" />
                Profile
              </Menubar.Item>
              <Menubar.Item
                class="rounded-xs flex items-center gap-2 px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
                href="/settings"
                title="Go to your user settings"
              >
                <span class="icon-[tabler--settings] text-lg" />
                Settings
              </Menubar.Item>
              <Menubar.Item asChild let:builder>
                <form action="/logout" method="post">
                  <button
                    class="rounded-xs flex w-full items-center gap-2 px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border"
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
