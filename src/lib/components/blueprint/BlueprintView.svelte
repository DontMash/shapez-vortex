<script lang="ts">
  import { Canvas, T, type ThrelteContext } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
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
  {#if controls}
    <div
      class="absolute left-1/2 top-0 z-10 flex h-fit w-fit -translate-x-1/2 justify-center space-x-4 p-4"
    >
      {#if controls.upload || controls.download}
        <div class="join">
          {#if controls.upload}
            <form
              class="btn btn-square btn-primary join-item"
              method="post"
              action="/blueprint/?/upload"
              enctype="multipart/form-data"
            >
              <label
                class="flex h-full w-full items-center justify-center"
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
                <span
                  class="icon-[tabler--file-upload] align-text-bottom text-2xl"
                  >Load blueprint</span
                >
              </label>
            </form>
          {/if}
          {#if controls.download}
            <form
              class="btn btn-square btn-primary join-item"
              action="/api/v1/blueprint/download"
            >
              <input
                name="identifier"
                type="hidden"
                value={identifier}
                required
              />
              <button
                class="h-full w-full"
                title="Download blueprint"
                type="submit"
              >
                <span
                  class="icon-[tabler--file-download] align-text-bottom text-2xl"
                  >Download</span
                >
              </button>
            </form>
          {/if}
          {#if controls.upload}
            <form class="btn btn-square btn-primary join-item">
              <input name="identifier" type="hidden" required />
              <button
                class="h-full w-full"
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
                <span
                  class="icon-[tabler--clipboard-text] align-text-bottom text-2xl"
                  >Paste</span
                >
              </button>
            </form>
          {/if}
          {#if controls.download}
            <button
              class="btn btn-square btn-primary join-item"
              title="Copy blueprint"
              use:copy={{ value: identifier }}
              on:copy={() => add({ message: 'Content copied' })}
              on:error={(event) =>
                add({
                  message: event.detail.message,
                  type: 'ERROR',
                })}
            >
              <span class="icon-[tabler--copy] align-text-bottom text-2xl"
                >Copy</span
              >
            </button>
          {/if}
        </div>
      {/if}

      {#if controls.utils}
        <div class="join">
          <button
            class="btn btn-square btn-secondary join-item"
            title="Capture blueprint"
            use:capture={{
              captureElement:
                ctx?.renderer.domElement ?? document.createElement('canvas'),
              filename: title,
            }}
          >
            <span class="icon-[tabler--camera] align-text-bottom text-2xl"
              >Camera</span
            >
          </button>
          <button
            class="btn btn-square btn-secondary join-item"
            title={`Turn fullscreen ${isFullscreen ? 'off' : 'on'}`}
            use:fullscreen={{ fullscreenElement: viewer }}
            on:change={(event) => (isFullscreen = event.detail)}
            on:error={(event) =>
              add({
                message: event.detail.message,
                type: 'ERROR',
              })}
          >
            {#if !isFullscreen}
              <span
                class="icon-[material-symbols--fullscreen-rounded] align-text-bottom text-2xl"
              >
                Turn fullscreen on
              </span>
            {:else}
              <span
                class="icon-[material-symbols--fullscreen-exit-rounded] align-text-bottom text-2xl"
              >
                Turn fullscreen off
              </span>
            {/if}
          </button>
          <button
            class="btn btn-square btn-secondary join-item"
            title="Reset controls"
            on:click={() => reset()}
          >
            <span class="icon-[tabler--reload] align-text-bottom text-2xl"
              >Reset</span
            >
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <div
    class="h-full overflow-hidden border-base-content/20 bg-base-100 shadow-lg outline-none transition-[border-radius] {!isFullscreen
      ? 'border lg:rounded-md'
      : ''}"
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
