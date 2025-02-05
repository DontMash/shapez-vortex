<script lang="ts">
  import { Canvas, T, type ThrelteContext } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { DropdownMenu } from 'bits-ui';
  import screenfull from 'screenfull';
  import { blur } from 'svelte/transition';
  import { MOUSE } from 'three';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';
  import {
    BLUEPRINT_FILE_FORMAT,
    BLUEPRINT_GRID_COLOR,
    BLUEPRINT_GRID_SIZE,
    ISLAND_LAYOUT_UNIT,
    type Blueprint,
    type BlueprintIdentifier,
    type BlueprintIslandEntry,
  } from '$lib/blueprint.types';
  import { capture } from '$lib/client/actions/capture';
  import { copy, paste } from '$lib/client/actions/clipboard';
  import { fullscreen } from '$lib/client/actions/fullscreen';
  import { add } from '$lib/client/toast.service';

  import BlueprintBuilding from './BlueprintBuilding.svelte';

  import { button } from '$lib/components/button';

  type ControlOptions = {
    download?: boolean;
    upload?: boolean;
    zoom?: boolean;
    utils?: boolean;
  };

  export let identifier: BlueprintIdentifier;
  export let blueprint: Blueprint | undefined;
  export let title: string = 'Untitled blueprint';
  export let controls: ControlOptions = {
    download: false,
    upload: false,
    zoom: true,
    utils: true,
  };

  let ctx: ThrelteContext | undefined;
  let viewer: HTMLElement | undefined;
  let orbitControls: OrbitControls | undefined;
  let isFullscreen = false;

  function reset() {
    if (!orbitControls) return;

    const ref = orbitControls.ref as OrbitControlsType;
    ref.enableDamping = false;
    ref.reset();
    ref.enableDamping = true;
  }
  function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.form?.submit();
  }
  function onPaste(event: Event) {
    const customEvent = event as CustomEvent<string>;
    const button = customEvent.target as HTMLButtonElement;
    const input = button.form?.querySelector(
      'input[name=identifier]',
    ) as HTMLInputElement | null;
    if (!input) {
      throw new Error('No input element "identifier"');
    }
    input.value = customEvent.detail.trim();
    button.form?.submit();
    button.form?.reset();
  }

  function getBlueprintIslandPosition(
    entry: BlueprintIslandEntry,
  ): [number, number, number] {
    const x = entry.X ?? 0;
    const z = entry.Y ?? 0;
    const offset = ISLAND_LAYOUT_UNIT * 0.5;

    return [
      x * ISLAND_LAYOUT_UNIT - offset,
      0,
      z * ISLAND_LAYOUT_UNIT - offset,
    ];
  }

  export function canvas() {
    return ctx?.renderer.domElement;
  }
</script>

<figure
  class="{isFullscreen ? '' : 'aspect-h-3 aspect-w-4'} relative"
  bind:this={viewer}
>
  {#if Object.values(controls).filter((value) => value === true).length}
    <div
      class="absolute left-1/2 top-4 z-10 flex h-fit w-fit max-w-5xl -translate-x-1/2 justify-center gap-2 rounded-md border bg-layer/70 p-2 backdrop-blur-lg"
    >
      {#if controls.upload || controls.download}
        {#if controls.upload}
          <form
            class="contents"
            method="post"
            action="/blueprint/?/upload"
            enctype="multipart/form-data"
          >
            <label
              class="{button({
                intent: 'accent',
                size: 'icon',
              })} cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent focus-within:hover:outline-accent-hover focus-within:active:outline-accent-active"
              for="blueprint-file"
            >
              <input
                class="sr-only"
                id="blueprint-file"
                name="file"
                type="file"
                accept={BLUEPRINT_FILE_FORMAT}
                required
                on:change={(event) => onFileChange(event)}
              />
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
            <button
              class={button({ intent: 'accent', size: 'icon' })}
              title="Download blueprint"
            >
              <span class="icon-[tabler--file-download]">Download</span>
            </button>
          </form>
        {/if}
        {#if controls.upload}
          <form class="contents">
            <input name="identifier" type="hidden" required />
            <button
              class={button({ intent: 'accent', size: 'icon' })}
              title="Paste blueprint"
              type="button"
              use:paste
              on:paste={(event) => onPaste(event)}
              on:error={(event) =>
                add({
                  message: event.detail.message,
                  type: 'ERROR',
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
            use:copy={{ value: identifier }}
            on:copy={() => add({ message: 'Content copied' })}
            on:error={(event) =>
              add({
                message: event.detail.message,
                type: 'ERROR',
              })}
          >
            <span class="icon-[tabler--copy]">Copy</span>
          </button>
        {/if}
      {/if}

      {#if controls.utils}
        <DropdownMenu.Root preventScroll={false} portal={viewer}>
          <DropdownMenu.Trigger
            class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
          >
            <span class="icon-[tabler--dots]">More options</span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            class="z-20 h-fit w-fit space-y-1 rounded-md border bg-layer/70 p-2 shadow-lg outline-none backdrop-blur-lg"
            transition={blur}
            transitionConfig={{ duration: 150 }}
            sideOffset={16}
            align="end"
            alignOffset={8}
          >
            <DropdownMenu.Item asChild let:builder>
              <button
                class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                title="Capture blueprint"
                use:capture={{
                  captureElement:
                    ctx?.renderer.domElement ??
                    document.createElement('canvas'),
                  filename: title,
                }}
                {...builder}
              >
                <span class="icon-[tabler--camera] text-lg" />
                Take picture
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild let:builder>
              <button
                class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                type="button"
                title={`Turn fullscreen ${screenfull.isFullscreen ? 'off' : 'on'}`}
                use:fullscreen={{ fullscreenElement: viewer }}
                on:error={(event) =>
                  add({ message: event.detail.message, type: 'ERROR' })}
                {...builder}
              >
                {#if screenfull.isFullscreen}
                  <span class="icon-[tabler--maximize-off] text-lg" />
                {:else}
                  <span class="icon-[tabler--maximize] text-lg" />
                {/if}
                Fullscreen
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild let:builder>
              <button
                class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                title="Reset controls"
                on:click={() => reset()}
                {...builder}
              >
                <span class="icon-[tabler--reload] text-lg" />
                Reset
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </div>
  {/if}

  <div
    class="h-full overflow-hidden rounded-lg border bg-background shadow-lg outline-none transition"
  >
    <Canvas rendererParameters={{ preserveDrawingBuffer: true }} bind:ctx>
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
          bind:this={orbitControls}
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
          {#each blueprint.BP.Entries as buildingEntry}
            <BlueprintBuilding entry={buildingEntry} />
          {/each}
        {/if}
        {#if blueprint.BP.$type === 'Island'}
          {#each blueprint.BP.Entries as islandEntry}
            <T.Group position={getBlueprintIslandPosition(islandEntry)}>
              {@const islandBlueprint = islandEntry.B}
              {#if islandBlueprint}
                {#each islandBlueprint.Entries as buildingEntry}
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
