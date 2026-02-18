<script lang="ts">
  import { Command, Dialog } from 'bits-ui';
  import { cva } from 'class-variance-authority';
  import { fade } from 'svelte/transition';
  import { page } from '$app/state';
  import { isShapeIdentifier } from '$lib/shape';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';

  const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
  let os = $derived(page.data.agent?.os);

  const kbd = cva([
    'inline-flex',
    'size-6',
    'items-center',
    'justify-center',
    'rounded-xs',
    'border',
    'bg-background',
  ]);
  const command = {
    group: cva(['flex', 'flex-col', 'gap-1']),
    heading: cva(['small', 'px-3', 'text-muted']),
    item: cva([
      'flex',
      'items-center',
      'gap-2',
      'rounded-xs',
      'px-3',
      'py-2',
      'transition',
      'data-selected:bg-border',
    ]),
  };

  let isSearchDialogOpen = $state(false);
  let searchValue = $state('');

  $effect(() => {
    if (!isSearchDialogOpen) {
      searchValue = '';
    }
  });

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

<svelte:window onkeydown={onKeyDown} />

<Dialog.Root bind:open={isSearchDialogOpen}>
  <Dialog.Trigger
    class={button({ kind: 'outline', intent: 'muted' })}
    title="Search the Shapez Vortex"
  >
    <span class="icon-[tabler--search]"></span>
    Search
    {#if os && os.name && OPERATING_SYSTEMS.find((value) => value === os?.name)}
      <span class=" hidden sm:block">
        {#if os.name === OPERATING_SYSTEMS[0]}
          <kbd class={kbd()}>⌘</kbd>
        {/if}
        {#if os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]}
          <kbd class={kbd()}>Ctrl</kbd>
        {/if}
        <kbd class={kbd()}>K</kbd>
      </span>
    {/if}
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay class={dialog.overlay()} />
    <Dialog.Content forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class={dialog.content()}
            transition:fade={{ duration: 150 }}
          >
            <Dialog.Title class="sr-only" level={2}
              >Search the Shapez Vortex</Dialog.Title
            >
            <Dialog.Description class="sr-only"
              >This dialog allows you to search all the content of the Shapez
              Vortex community-platform.</Dialog.Description
            >

            <Command.Root
              class="bg-layer relative rounded-lg border"
              label="Search"
              loop
            >
              <Dialog.Close
                class="{button({
                  kind: 'outline',
                  intent: 'muted',
                  size: 'icon-sm',
                })} absolute top-4 right-4"
              >
                <span class="icon-[tabler--x] text-lg">Close search dialog</span
                >
              </Dialog.Close>

              <div class="flex items-center gap-2 border-b py-4 pr-16 pl-4">
                <span class="icon-[tabler--search]"></span>
                <Command.Input
                  class="placeholder:text-muted h-8 w-full bg-transparent outline-hidden"
                  placeholder="Search the vortex..."
                  autofocus
                  bind:value={searchValue}
                />
              </div>

              <Command.List>
                <Command.Viewport
                  class="flex max-h-96 flex-col gap-2 overflow-y-auto px-1 py-4"
                >
                  <Command.Empty class="text-center">
                    No results found.
                  </Command.Empty>

                  {#if searchValue}
                    <Command.Group class={command.group()} value="$1">
                      <Command.GroupHeading class={command.heading()}>
                        Blueprints
                      </Command.GroupHeading>
                      <Command.GroupItems>
                        {#each page.data.searchBlueprints as blueprint (blueprint.id)}
                          <Command.LinkItem
                            class={command.item()}
                            href="/blueprint/{blueprint.id}"
                            value="{blueprint.title}_{blueprint.id}"
                            onSelect={() => (isSearchDialogOpen = false)}
                          >
                            <span class="icon-[tabler--schema]"></span>
                            <span class="truncate">
                              {blueprint.title}
                            </span>
                            {#if blueprint.expand && blueprint.expand['creator']}
                              <span
                                class="{button({
                                  intent: 'accent',
                                  size: 'xs',
                                })} ml-auto"
                              >
                                @{blueprint.expand['creator'].displayname}
                              </span>
                            {/if}
                          </Command.LinkItem>
                        {/each}
                        <Command.LinkItem
                          class={command.item()}
                          href="/blueprint/search?query={searchValue}"
                          value="$"
                          forceMount={!isShapeIdentifier(searchValue)}
                          onSelect={() => (isSearchDialogOpen = false)}
                        >
                          <span class="icon-[tabler--search]"></span>
                          Show more...
                        </Command.LinkItem>
                      </Command.GroupItems>
                    </Command.Group>

                    <Command.Group class={command.group()} value="$2">
                      <Command.GroupHeading class={command.heading()}>
                        Users
                      </Command.GroupHeading>
                      <Command.GroupItems>
                        {#each page.data.searchUsers as user (user.displayname)}
                          <Command.LinkItem
                            class={command.item()}
                            href="/user/@{user.displayname}"
                            onSelect={() => (isSearchDialogOpen = false)}
                          >
                            <span class="icon-[tabler--user]"></span>
                            <span class="truncate">
                              {user.displayname}
                            </span>
                          </Command.LinkItem>
                        {/each}
                      </Command.GroupItems>
                    </Command.Group>
                  {/if}

                  <Command.Group class={command.group()} value="$3">
                    <Command.GroupHeading class={command.heading()}>
                      Features
                    </Command.GroupHeading>
                    <Command.GroupItems>
                      {#if searchValue}
                        <Command.LinkItem
                          class={command.item()}
                          href="/shape?identifier={searchValue}"
                          value={isShapeIdentifier(searchValue)
                            ? searchValue
                            : '$'}
                          forceMount={isShapeIdentifier(searchValue)}
                          onSelect={() => (isSearchDialogOpen = false)}
                        >
                          <span class="icon-[tabler--stack]"></span>
                          <span class="truncate">
                            View Shape - {searchValue}
                          </span>
                        </Command.LinkItem>
                      {/if}
                      <Command.LinkItem
                        class={command.item()}
                        href="/shape"
                        onSelect={() => (isSearchDialogOpen = false)}
                      >
                        <span class="icon-[tabler--stack]"></span>
                        Shape Viewer
                      </Command.LinkItem>
                      <Command.LinkItem
                        class={command.item()}
                        href="/blueprint"
                        onSelect={() => (isSearchDialogOpen = false)}
                      >
                        <span class="icon-[tabler--schema]"></span>
                        Blueprint Viewer
                      </Command.LinkItem>
                      <Command.LinkItem
                        class={command.item()}
                        href="/blueprint/upload"
                        onSelect={() => (isSearchDialogOpen = false)}
                      >
                        <span class="icon-[tabler--upload]"></span>
                        Upload
                      </Command.LinkItem>
                      <Command.LinkItem
                        class={command.item()}
                        href="/user"
                        onSelect={() => (isSearchDialogOpen = false)}
                      >
                        <span class="icon-[tabler--user]"></span>
                        Profile
                      </Command.LinkItem>
                      <Command.LinkItem
                        class={command.item()}
                        href="/settings"
                        onSelect={() => (isSearchDialogOpen = false)}
                      >
                        <span class="icon-[tabler--settings]"></span>
                        Settings
                      </Command.LinkItem>
                    </Command.GroupItems>
                  </Command.Group>
                </Command.Viewport>
              </Command.List>
            </Command.Root>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
