<script lang="ts">
  import { DropdownMenu, Popover, Tabs } from 'bits-ui';
  import screenfull from 'screenfull';
  import { blur } from 'svelte/transition';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';

  import { page } from '$app/state';
  import { copy } from '$lib/client/actions/clipboard.svelte';
  import { fullscreen } from '$lib/client/actions/fullscreen.svelte';
  import ToastService from '$lib/client/toast.svelte';
  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import type { ShapeData } from '$lib/shape';

  import ShapeCanvas from './ShapeCanvas.svelte';
  import type { ThrelteVector3 } from '$lib/three';

  const SHAPE_CAMERA_TOP_POSITION: ThrelteVector3 = [0, 1.5, 0];

  interface Props {
    data: ShapeData;
    isExtended?: boolean;
    isExpanded?: boolean;
  }

  let { data, isExtended = false, isExpanded = false }: Props = $props();

  let canvasElement: HTMLCanvasElement | undefined = $state();
  let viewer: HTMLElement | undefined = $state();
  let orbitControls: OrbitControlsType | undefined = $state();

  const toastService = ToastService.instance;

  const shareLink = $derived(
    `${page.url.origin}/shape?identifier=${data.identifier}`,
  );
  const embedCode = $derived(
    `<iframe title="Shape - ${data.identifier}" src="${page.url.origin}/shape/embed?identifier=${data.identifier}" width="100%" height="400" frameborder="0"></iframe>`,
  );

  function onCapture() {
    canvasElement?.toBlob(
      (blob) => {
        if (!blob) return;

        const items = { [blob.type]: blob };
        const clipboardItem = new ClipboardItem(items);
        navigator.clipboard
          .write([clipboardItem])
          .then(() => toastService.add({ message: 'Copied shape image' }))
          .catch(() =>
            toastService.add({
              message: 'Error while creating shape image',
              type: 'ERROR',
            }),
          );
      },
      'image/png',
      1,
    );
  }
  function onReset() {
    setCameraPosition();
  }
  function onTop() {
    setCameraPosition(SHAPE_CAMERA_TOP_POSITION);
  }
  function setCameraPosition(value?: ThrelteVector3) {
    if (!orbitControls) return;

    orbitControls.enableDamping = false;
    orbitControls.update();
    if (value) {
      orbitControls.object.position.set(...value);
    } else {
      orbitControls.reset();
    }
    orbitControls.enableDamping = true;
  }
</script>

<figure
  class="bg-background relative rounded-lg border pt-4"
  bind:this={viewer}
>
  <div class="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-4">
    <form class="bg-layer flex grow items-center gap-2 rounded-md border p-2">
      <label
        class="{input.group()} w-full"
        for="shape-identifier"
        aria-label="Shape identifier"
      >
        <input
          class={input.field()}
          type="text"
          id="shape-identifier"
          name="identifier"
          placeholder="Shape code..."
          value={page.data.shape?.identifier ?? null}
          required
          minlength="2"
        />

        <button
          class={button({ kind: 'ghost', intent: 'muted', size: 'icon-sm' })}
          type="reset"
          title="Clear shape input"
        >
          <span class="icon-[tabler--x] text-lg"></span>
          <span class="sr-only">Clear shape input</span>
        </button>
      </label>

      <button class="{button({ size: 'icon' })} shrink-0">
        <span class="icon-[tabler--arrow-narrow-right]">View</span>
      </button>
    </form>

    <div class="bg-layer flex gap-2 rounded-md border p-2">
      <form class="contents" action="/shape">
        <input name="identifier" type="hidden" value={data.identifier} />
        <input name="extend" type="hidden" value={!isExtended} />
        <input name="expand" type="hidden" value={isExpanded} />
        <button
          class={button({ intent: 'accent', size: 'icon' })}
          title="{isExtended ? 'Contract' : 'Extend'} layers"
        >
          {#if isExtended}
            <span class="icon-[tabler--stack-forward]">Contraact layers</span>
          {:else}
            <span class="icon-[tabler--stack]">Extend layers</span>
          {/if}
        </button>
      </form>
      <form class="contents" action="/shape">
        <input name="identifier" type="hidden" value={data.identifier} />
        <input name="extend" type="hidden" value={isExtended} />
        <input name="expand" type="hidden" value={!isExpanded} />
        <button
          class={button({ intent: 'accent', size: 'icon' })}
          title="{isExpanded ? 'Collapse' : 'Expand'} parts"
        >
          {#if isExpanded}
            <span class="icon-[tabler--border-none]">Collapse parts</span>
          {:else}
            <span class="icon-[tabler--border-all]">Expand parts</span>
          {/if}
        </button>
      </form>
      <form class="contents" method="post" action="/shape/?/random">
        <button
          class={button({ intent: 'accent', size: 'icon' })}
          title="Randomize shape"
        >
          <span class="icon-[tabler--arrows-shuffle]">Shuffle</span>
        </button>
      </form>

      <Popover.Root>
        <Popover.Trigger
          class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
        >
          <span class="icon-[tabler--share]">Share</span>
        </Popover.Trigger>

        <Popover.Content
          class="bg-layer/70 z-20 w-80 space-y-1 rounded-md border p-2 shadow-lg outline-hidden backdrop-blur-lg"
          sideOffset={16}
          align="end"
          alignOffset={-8}
        >
          <Tabs.Root value="link">
            <Tabs.List class="bg-muted mb-2 flex rounded-xs p-1">
              <Tabs.Trigger
                class="data-[state=active]:bg-background flex-1 rounded-xs px-2 py-1 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                value="link"
              >
                Link
              </Tabs.Trigger>
              <Tabs.Trigger
                class="data-[state=active]:bg-background flex-1 rounded-xs px-2 py-1 text-sm font-medium transition-all data-[state=active]:shadow-sm"
                value="embed"
              >
                Embed
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="link" class="outline-hidden">
              <div class="flex flex-col gap-2">
                <p class="text-muted-foreground text-sm">
                  Share this shape via direct link.
                </p>
                <div class={input.group()}>
                  <input
                    class={input.field()}
                    type="text"
                    value={shareLink}
                    readonly
                  />
                  <button
                    class="{button({
                      kind: 'ghost',
                      intent: 'muted',
                      size: 'icon-sm',
                    })} shrink-0"
                    title="Copy link"
                    {@attach copy({
                      value: shareLink,
                      oncopy: () =>
                        toastService.add({ message: 'Link copied' }),
                      onerror: (error) =>
                        toastService.add({
                          message: error.message,
                          type: 'ERROR',
                        }),
                    })}
                  >
                    <span class="icon-[tabler--copy] text-lg"></span>
                    <span class="sr-only">Copy link</span>
                  </button>
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="embed" class="outline-hidden">
              <div class="flex flex-col gap-2">
                <p class="text-muted-foreground text-sm">
                  Embed this shape in your website.
                </p>
                <div class={input.group()}>
                  <input
                    class={input.field()}
                    type="text"
                    value={embedCode}
                    readonly
                  />
                  <button
                    class="{button({
                      kind: 'ghost',
                      intent: 'muted',
                      size: 'icon-sm',
                    })} shrink-0"
                    title="Copy embed code"
                    {@attach copy({
                      value: embedCode,
                      oncopy: () =>
                        toastService.add({ message: 'Embed code copied' }),
                      onerror: (error) =>
                        toastService.add({
                          message: error.message,
                          type: 'ERROR',
                        }),
                    })}
                  >
                    <span class="icon-[tabler--copy] text-lg"></span>
                    <span class="sr-only">Copy embed code</span>
                  </button>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Popover.Content>
      </Popover.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
        >
          <span class="icon-[tabler--dots]">More options</span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          class="bg-layer/70 z-20 space-y-1 rounded-md border p-2 shadow-lg outline-hidden backdrop-blur-lg"
          sideOffset={16}
          align="end"
          alignOffset={-8}
          forceMount
        >
          {#snippet child({ wrapperProps, props, open })}
            {#if open}
              <div {...wrapperProps}>
                <div {...props} transition:blur={{ duration: 150 }}>
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <button
                        class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                        title="Copy shape"
                        {...props}
                        {@attach copy({
                          value: data.identifier,
                          oncopy: () =>
                            toastService.add({
                              message: 'Shape identifier copied',
                            }),
                          onerror: (error) =>
                            toastService.add({
                              message: error.message,
                              type: 'ERROR',
                            }),
                        })}
                      >
                        <span class="icon-[tabler--copy] text-lg"></span>
                        Copy shape
                      </button>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={onCapture}>
                    {#snippet child({ props })}
                      <button
                        class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                        title="Capture shape"
                        {...props}
                      >
                        <span class="icon-[tabler--camera] text-lg"></span>
                        Take picture
                      </button>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <button
                        class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                        type="button"
                        title={`Turn fullscreen ${screenfull.isFullscreen ? 'off' : 'on'}`}
                        {...props}
                        {@attach fullscreen({
                          fullscreenElement: viewer!,
                          onerror: (error) =>
                            toastService.add({
                              message: error.message,
                              type: 'ERROR',
                            }),
                        })}
                      >
                        {#if screenfull.isFullscreen}
                          <span class="icon-[tabler--maximize-off] text-lg"
                          ></span>
                        {:else}
                          <span class="icon-[tabler--maximize] text-lg"></span>
                        {/if}
                        Fullscreen
                      </button>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => onTop()}>
                    {#snippet child({ props })}
                      <button
                        class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                        type="button"
                        title="View top down"
                        {...props}
                      >
                        <span class="icon-[tabler--circle] text-lg"></span>
                        View top
                      </button>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => onReset()}>
                    {#snippet child({ props })}
                      <form class="contents" action="/shape">
                        <input
                          name="identifier"
                          type="hidden"
                          value={data.identifier}
                        />
                        <button
                          class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                          title="Reset controls"
                          {...props}
                        >
                          <span class="icon-[tabler--reload] text-lg"></span>
                          Reset
                        </button>
                      </form>
                    {/snippet}
                  </DropdownMenu.Item>
                </div>
              </div>
            {/if}
          {/snippet}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <div
    class="mx-auto max-w-[60vh] data-[is-fullscreen=true]:max-w-[100vh]"
    data-is-fullscreen={screenfull.isFullscreen}
  >
    <div class="aspect-square">
      <ShapeCanvas
        {data}
        {isExpanded}
        {isExtended}
        bind:orbitControls
        bind:canvasElement
      />
    </div>
  </div>

  <figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
