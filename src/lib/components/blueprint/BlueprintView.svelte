<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { DropdownMenu } from 'bits-ui';
  import screenfull from 'screenfull';
  import { tick } from 'svelte';
  import { blur } from 'svelte/transition';
  import { MOUSE, NoToneMapping, WebGLRenderer } from 'three';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';
  import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.schema';
  import type {
    Blueprint,
    BlueprintIdentifier,
    BlueprintIslandEntry,
  } from '$lib/blueprint.types';
  import { capture } from '$lib/client/actions/capture.svelte';
  import { copy, paste } from '$lib/client/actions/clipboard.svelte';
  import { fullscreen } from '$lib/client/actions/fullscreen.svelte';
  import { add } from '$lib/client/toast.service';

  import { button } from '$lib/components/button';

  import BlueprintBuilding from './BlueprintBuilding.svelte';

  const BLUEPRINT_GRID_SIZE = 1001;
  const BLUEPRINT_GRID_COLOR = 0x444444;

  const BLUEPRINT_ISLAND_PADDING_SIZE = 3;
  const BLUEPRINT_ISLAND_GAP_SIZE = BLUEPRINT_ISLAND_PADDING_SIZE * 2;
  const BLUEPRINT_ISLAND_MIN_SIZE = 12;
  const BLUEPRINT_ISLAND_LAYOUT_UNIT =
    BLUEPRINT_ISLAND_MIN_SIZE + BLUEPRINT_ISLAND_GAP_SIZE;

  type ControlOptions = {
    download?: boolean;
    upload?: boolean;
    zoom?: boolean;
    utils?: boolean;
  };

  interface Props {
    identifier: BlueprintIdentifier;
    blueprint: Blueprint | undefined;
    title?: string;
    controls?: ControlOptions;
  }

  let {
    identifier,
    blueprint,
    title = 'Untitled blueprint',
    controls = {
      download: false,
      upload: false,
      zoom: true,
      utils: true,
    },
  }: Props = $props();

  let viewer: HTMLElement | undefined = $state();
  let viewForm: HTMLFormElement | undefined = $state();
  let canvasElement: HTMLCanvasElement | undefined = $state();
  let orbitControls: OrbitControlsType | undefined = $state();
  let isFullscreen = false;
  let uploadIdentifier: string | undefined = $state();

  function reset() {
    if (!orbitControls) return;

    const ref = orbitControls;
    ref.enableDamping = false;
    ref.reset();
    ref.enableDamping = true;
  }
  async function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }
    uploadIdentifier = await input.files[0].text();
    tick().then(() => input.form?.requestSubmit());
  }
  function onPaste(value: string) {
    const input = viewForm?.querySelector(
      'input[name=identifier]',
    ) as HTMLInputElement | null;
    if (!input) {
      throw new Error('No input element "identifier"');
    }
    input.value = value.trim();
    viewForm?.requestSubmit();
    viewForm?.reset();
  }

  function getBlueprintIslandPosition(
    entry: BlueprintIslandEntry,
  ): [number, number, number] {
    const x = entry.X ?? 0;
    const z = entry.Y ?? 0;
    const offset = BLUEPRINT_ISLAND_LAYOUT_UNIT * 0.5;

    return [
      x * BLUEPRINT_ISLAND_LAYOUT_UNIT - offset,
      0,
      z * BLUEPRINT_ISLAND_LAYOUT_UNIT - offset,
    ];
  }

  export const canvas = () => {
    return canvasElement;
  };
</script>

<figure
  class="{isFullscreen ? '' : 'aspect-[4/3]'} relative"
  bind:this={viewer}
>
  {#if Object.values(controls).filter((value) => value === true).length}
    <div
      class="bg-layer/70 absolute top-4 left-1/2 z-10 flex h-fit w-fit max-w-5xl -translate-x-1/2 justify-center gap-2 rounded-md border p-2 backdrop-blur-lg"
    >
      {#if controls.upload || controls.download}
        {#if controls.upload}
          <form
            class="contents"
            method="post"
            action="/blueprint/?/view"
            enctype="multipart/form-data"
          >
            <label
              class="{button({
                intent: 'accent',
                size: 'icon',
              })} focus-within:outline-accent focus-within:hover:outline-accent-hover focus-within:active:outline-accent-active cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid"
              for="blueprint-file"
            >
              <input
                class="sr-only"
                id="blueprint-file"
                type="file"
                accept={BLUEPRINT_FILE_FORMAT}
                required
                onchange={(event) => onFileChange(event)}
              />
              <input type="hidden" name="identifier" value={uploadIdentifier} />
              <span class="icon-[tabler--file-upload]">Load blueprint</span>
            </label>
          </form>
        {/if}
        {#if controls.download}
          <form class="contents" action="/api/v1/blueprint/download">
            <input
              name="identifier"
              type="hidden"
              value={identifier}
              required
            />
            {#if title}
              <input name="title" type="hidden" value={title} required />
            {/if}
            <button
              class={button({ intent: 'accent', size: 'icon' })}
              title="Download blueprint"
            >
              <span class="icon-[tabler--file-download]">Download</span>
            </button>
          </form>
        {/if}
        {#if controls.upload}
          <form class="contents" bind:this={viewForm}>
            <input name="identifier" type="hidden" required />
            <button
              class={button({ intent: 'accent', size: 'icon' })}
              title="Paste blueprint"
              type="button"
              {@attach paste({
                onpaste: (value) => {
                  onPaste(value);
                  add({
                    message: 'Blueprint pasted.',
                  });
                },
                onerror: (error) =>
                  add({
                    message: error.message,
                    type: 'ERROR',
                  }),
              })}
            >
              <span class="icon-[tabler--clipboard-text]">Paste</span>
            </button>
          </form>
        {/if}
        {#if controls.download}
          <button
            class={button({ intent: 'accent', size: 'icon' })}
            title="Copy blueprint"
            {@attach copy({
              value: identifier,
              oncopy: () => add({ message: 'Content copied' }),
              onerror: (error) =>
                add({
                  message: error.message,
                  type: 'ERROR',
                }),
            })}
          >
            <span class="icon-[tabler--copy]">Copy</span>
          </button>
        {/if}
      {/if}

      {#if controls.utils}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
          >
            <span class="icon-[tabler--dots]">More options</span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            class="bg-layer z-20 h-fit w-fit space-y-1 rounded-md border p-2 shadow-lg outline-hidden backdrop-blur-lg"
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
                          title="Capture blueprint"
                          {...props}
                          {@attach capture({
                            canvas: canvasElement!,
                            filename: title,
                          })}
                        >
                          <span class="icon-[tabler--camera] text-lg"></span>
                          Take picture
                        </button>
                      {/snippet}
                    </DropdownMenu.Item>
                    {#if viewer}
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
                                add({
                                  message: error.message,
                                  type: 'ERROR',
                                }),
                            })}
                          >
                            {#if screenfull.isFullscreen}
                              <span class="icon-[tabler--maximize-off] text-lg"
                              ></span>
                            {:else}
                              <span class="icon-[tabler--maximize] text-lg"
                              ></span>
                            {/if}
                            Fullscreen
                          </button>
                        {/snippet}
                      </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Item onSelect={() => reset()}>
                      {#snippet child({ props })}
                        <button
                          class="hover:bg-border focus-visible:bg-border data-highlighted:bg-border flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-hidden transition"
                          title="Reset controls"
                          {...props}
                        >
                          <span class="icon-[tabler--reload] text-lg"></span>
                          Reset
                        </button>
                      {/snippet}
                    </DropdownMenu.Item>
                  </div>
                </div>
              {/if}
            {/snippet}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>
  {/if}

  <div
    class="bg-background h-full overflow-hidden rounded-lg border shadow-lg outline-hidden transition"
  >
    <Canvas
      toneMapping={NoToneMapping}
      createRenderer={(canvas) => {
        canvasElement = canvas;
        return new WebGLRenderer({
          canvas,
          alpha: true,
          preserveDrawingBuffer: true,
        });
      }}
    >
      <T.PerspectiveCamera makeDefault position={[0, 15, 15]} fov={55}>
        <OrbitControls
          enableDamping
          enableZoom={controls.zoom}
          screenSpacePanning={false}
          minDistance={5}
          maxDistance={40}
          maxPolarAngle={Math.PI * 0.4}
          mouseButtons={{
            LEFT: MOUSE.PAN,
            RIGHT: MOUSE.ROTATE,
          }}
          bind:ref={orbitControls}
        />
      </T.PerspectiveCamera>

      <T.AmbientLight intensity={1} />
      <T.DirectionalLight
        position={[1, 3, 1]}
        intensity={2}
        castShadow
        shadow.mapSize={[1024, 1024]}
      />

      <T.GridHelper
        args={[
          BLUEPRINT_GRID_SIZE,
          BLUEPRINT_GRID_SIZE,
          BLUEPRINT_GRID_COLOR,
          BLUEPRINT_GRID_COLOR,
        ]}
      />

      {#if blueprint}
        {#if blueprint.BP.$type === 'Building'}
          {#each blueprint.BP.Entries as buildingEntry (buildingEntry)}
            <BlueprintBuilding entry={buildingEntry} />
          {/each}
        {/if}
        {#if blueprint.BP.$type === 'Island'}
          {#each blueprint.BP.Entries as islandEntry (islandEntry)}
            <T.Group position={getBlueprintIslandPosition(islandEntry)}>
              {@const islandBlueprint = islandEntry.B}
              {#if islandBlueprint}
                {#each islandBlueprint.Entries as buildingEntry (buildingEntry)}
                  <BlueprintBuilding entry={buildingEntry} />
                {/each}
              {/if}
            </T.Group>
          {/each}
        {/if}
      {/if}
    </Canvas>
  </div>

  <figcaption class="sr-only">Blueprint View</figcaption>
</figure>
