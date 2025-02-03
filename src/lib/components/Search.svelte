<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { Command } from 'cmdk-sv';
  import { blur, fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isShapeIdentifier } from '$lib/shape.types';
  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';

  const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
  $: os = $page.data.agent?.os;

  let isSearchDialogOpen = false;
  let searchValue = '';
  $: {
    searchValue = isSearchDialogOpen ? '' : '';
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

<Dialog.Root bind:open={isSearchDialogOpen}>
  <Dialog.Trigger
    class={button({ kind: 'outline', intent: 'muted' })}
    title="Search the Shapez Vortex"
  >
    <span class="icon-[tabler--search]" />
    Search
    {#if os && os.name && OPERATING_SYSTEMS.find((value) => value === os?.name)}
      <span class=" hidden sm:block">
        {#if os.name === OPERATING_SYSTEMS[0]}
          <kbd
            class="inline-flex size-6 items-center justify-center rounded-xs border bg-background"
            >⌘</kbd
          >
        {/if}
        {#if os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]}
          <kbd
            class="inline-flex size-6 items-center justify-center rounded-xs border bg-background"
            >Ctrl</kbd
          >
        {/if}
        <kbd
          class="inline-flex size-6 items-center justify-center rounded-xs border bg-background"
          >K</kbd
        >
      </span>
    {/if}
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay
      class={dialog.overlay()}
      transition={blur}
      transitionConfig={{ duration: 150 }}
    />

    <Dialog.Content
      class={dialog.content()}
      transition={fade}
      transitionConfig={{ duration: 150 }}
    >
      <Dialog.Title class="sr-only" level="h2"
        >Search the Shapez Vortex</Dialog.Title
      >
      <Dialog.Description class="sr-only"
        >This dialog allows you to search all the content of the Shapez Vortex
        community-platform.</Dialog.Description
      >

      <div class="">
        <Command.Root
          class="relative rounded-lg border bg-layer"
          label="Search"
          loop
        >
          <Dialog.Close
            class="{button({
              kind: 'outline',
              intent: 'muted',
              size: 'icon-sm',
            })} absolute right-4 top-4"
          >
            <span class="icon-[tabler--x] text-lg">Close search dialog</span>
          </Dialog.Close>

          <div class="flex items-center gap-2 border-b py-4 pl-4 pr-16">
            <span class="icon-[tabler--search]" />
            <Command.Input
              class="h-8 w-full bg-transparent outline-none placeholder:text-muted"
              placeholder="Search the vortex..."
              bind:value={searchValue}
              autofocus
            />
          </div>

          <Command.List
            class="max-h-96 overflow-y-auto px-1 py-4 [&_[data-cmdk-group]+[data-cmdk-group]]:mt-4"
          >
            <Command.Empty class="text-center">No results found.</Command.Empty>

            {#if searchValue}
              {@const blueprints = $page.data.searchBlueprints}
              {#if blueprints.length > 0}
                <Command.Group
                  class="[&>[data-cmdk-group-heading]]:small [&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
                  heading="Blueprints"
                  alwaysRender
                >
                  {#each blueprints as blueprint}
                    <Command.Item
                      class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                      id={blueprint.id}
                      value={blueprint.title}
                      onSelect={() =>
                        command(() => goto(`/blueprint/${blueprint.id}`))}
                    >
                      <span class="icon-[tabler--schema]" />
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
                    </Command.Item>
                  {/each}
                  <Command.Item
                    class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
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
                  class="[&>[data-cmdk-group-heading]]:small [&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
                  heading="Users"
                >
                  {#each users as user}
                    <Command.Item
                      class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                      onSelect={() =>
                        command(() => goto(`/user/@${user.displayname}`))}
                    >
                      <span class="icon-[tabler--user]" />
                      <span class="truncate">
                        {user.displayname}
                      </span>
                    </Command.Item>
                  {/each}
                </Command.Group>
              {/if}
            {/if}

            <Command.Group
              class="[&>[data-cmdk-group-heading]]:small [&>[data-cmdk-group-heading]]:px-3 [&>[data-cmdk-group-heading]]:text-muted [&>[data-cmdk-item]+[data-cmdk-item]]:mt-1"
              heading="Features"
            >
              {#if isShapeIdentifier(searchValue)}
                <Command.Item
                  class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                  onSelect={() =>
                    command(() => goto(`/shape?identifier=${searchValue}`))}
                >
                  <span class="icon-[tabler--stack]" />
                  <span class="truncate">
                    View Shape - {searchValue}
                  </span>
                </Command.Item>
              {:else}
                <Command.Item
                  class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                  onSelect={() => command(() => goto('/shape'))}
                >
                  <span class="icon-[tabler--stack]" />
                  Shape Viewer
                </Command.Item>
              {/if}
              <Command.Item
                class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                onSelect={() => command(() => goto('/blueprint'))}
              >
                <span class="icon-[tabler--schema]" />
                Blueprint Viewer
              </Command.Item>

              {#if $page.data.user}
                {#if $page.data.user.verified}
                  <Command.Item
                    class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                    onSelect={() => command(() => goto('/blueprint/upload'))}
                  >
                    <span class="icon-[tabler--upload]" />
                    Upload
                  </Command.Item>
                {/if}
                <Command.Item
                  class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                  onSelect={() => command(() => goto('/user'))}
                >
                  <span class="icon-[tabler--user]" />
                  Profile
                </Command.Item>
                <Command.Item
                  class="flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 transition aria-selected:bg-border"
                  onSelect={() => command(() => goto('/settings'))}
                >
                  <span class="icon-[tabler--settings]" />
                  Settings
                </Command.Item>
              {/if}
            </Command.Group>
          </Command.List>
        </Command.Root>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
