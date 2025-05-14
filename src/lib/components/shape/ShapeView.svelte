<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import screenfull from 'screenfull';
  import { blur } from 'svelte/transition';
  import { page } from '$app/state';
  import { Group, NoToneMapping, WebGLRenderer, type Mesh } from 'three';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';
  import { Canvas, T } from '@threlte/core';
  import { OrbitControls, Suspense } from '@threlte/extras';
  import { copy } from '$lib/client/actions/clipboard';
  import { fullscreen } from '$lib/client/actions/fullscreen';
  import { add } from '$lib/client/toast.service';
  import {
    isDefaultShapeIdentifier,
    SHAPE_COLOR_BASE_MATERIAL,
    SHAPE_MAX_LAYERS,
    type ShapeData,
  } from '$lib/shape.types';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import ShapePart from '$lib/components/shape/ShapePart.svelte';
  import ShapeDefaultSupport from '$lib/components/models/shapes/ShapeDefaultSupport.svelte';

  type ThrelteVector3 = [x: number, y: number, z: number];

  const SHAPE_LAYER_HEIGHT = 0.05;
  const SHAPE_LAYER_SCALE = 1 / SHAPE_MAX_LAYERS;
  const SHAPE_LAYER_EXTEND_OFFSET = 0.15;
  const SHAPE_PART_EXPAND_OFFSET = 0.4;
  const SHAPE_CAMERA_START_POSITION: ThrelteVector3 = [0, 0, 1.5];
  const SHAPE_CAMERA_TOP_POSITION: ThrelteVector3 = [0, 1.5, 0];

  interface Props {
    data: ShapeData;
    isExtended?: boolean;
    isExpanded?: boolean;
  }

  let { data, isExtended = false, isExpanded = false }: Props = $props();

  let isHex = $derived(!isDefaultShapeIdentifier(data.identifier));

  let canvasElement: HTMLCanvasElement | undefined = $state();
  let viewer: HTMLElement | undefined = $state();
  let orbitControls: OrbitControlsType | undefined = $state();
  let baseComponentModel: Group | undefined = $state();

  function onCapture() {
    canvasElement?.toBlob(
      (blob) => {
        if (!blob) return;

        const items = { [blob.type]: blob };
        const clipboardItem = new ClipboardItem(items);
        navigator.clipboard
          .write([clipboardItem])
          .then(() => add({ message: 'Copied shape image' }))
          .catch(() =>
            add({
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

  const onBaseModelLoad = () => {
    if (!baseComponentModel) {
      throw new Error('[SHAPEVIEW] model not initialized');
    }

    const object = baseComponentModel;
    const mesh = object.children[0] as Mesh;
    mesh.material = SHAPE_COLOR_BASE_MATERIAL;
  };
</script>

<figure
  class="relative rounded-lg border bg-background pt-4"
  bind:this={viewer}
>
  <div class="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-4">
    <form class="flex grow items-center gap-2 rounded-md border bg-layer p-2">
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

    <div class="flex gap-2 rounded-md border bg-layer p-2">
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class={button({ kind: 'outline', intent: 'muted', size: 'icon' })}
        >
          <span class="icon-[tabler--dots]">More options</span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          class="z-20 space-y-1 rounded-md border bg-layer/70 p-2 shadow-lg outline-none backdrop-blur-lg"
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
                        class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                        title="Copy shape"
                        use:copy={{ value: data.identifier }}
                        oncopy={() =>
                          add({ message: 'Shape identifier copied' })}
                        onerror={(event) =>
                          add({ message: event.detail.message, type: 'ERROR' })}
                        {...props}
                      >
                        <span class="icon-[tabler--copy] text-lg"></span>
                        Copy shape
                      </button>
                    {/snippet}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={onCapture}>
                    {#snippet child({ props })}
                      <button
                        class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
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
                        class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                        type="button"
                        title={`Turn fullscreen ${screenfull.isFullscreen ? 'off' : 'on'}`}
                        use:fullscreen={{ fullscreenElement: viewer! }}
                        onerror={(event) =>
                          add({ message: event.detail.message, type: 'ERROR' })}
                        {...props}
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
                        class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
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
                          class="flex w-full items-center gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
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
    <div class="aspect-h-1 aspect-w-1">
      <div>
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
          <T.PerspectiveCamera
            makeDefault
            position={SHAPE_CAMERA_START_POSITION}
            fov={55}
          >
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableDamping
              maxPolarAngle={Math.PI * 0.35}
              bind:ref={orbitControls}
            />
          </T.PerspectiveCamera>

          <T.AmbientLight intensity={1} />
          <T.DirectionalLight
            position={[1, 3, 1]}
            intensity={2}
            castShadow
            shadow.mapSize={[2048, 2048]}
          />

          <T.Group position.y={-0.25}>
            <Suspense onload={onBaseModelLoad}>
              <ShapeDefaultSupport
                position.y={-0.025}
                bind:ref={baseComponentModel}
              />
            </Suspense>
            {#key data}
              {#each data.data.slice(0, SHAPE_MAX_LAYERS) as layer, layerIndex (layerIndex)}
                {@const layerPositionY = layerIndex * SHAPE_LAYER_HEIGHT}
                {@const layerScale = 1 - layerIndex * SHAPE_LAYER_SCALE}
                {@const extendOffset = isExtended
                  ? layerIndex * SHAPE_LAYER_EXTEND_OFFSET
                  : 0}
                {@const expandOffset = isExpanded
                  ? SHAPE_PART_EXPAND_OFFSET
                  : 0}
                <T.Group
                  position.y={layerPositionY + extendOffset}
                  scale={[layerScale, 0.5, layerScale]}
                >
                  {#each layer as part, partIndex (partIndex)}
                    <T.Group
                      rotation.y={partIndex *
                        (isHex ? -1 / 3 : -0.5) *
                        Math.PI +
                        Math.PI}
                    >
                      <ShapePart
                        data={part}
                        {isHex}
                        offset={expandOffset *
                          SHAPE_LAYER_SCALE *
                          (layerIndex + 1)}
                      />
                    </T.Group>
                  {/each}
                </T.Group>
              {/each}
            {/key}
          </T.Group>
        </Canvas>
      </div>
    </div>
  </div>

  <figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
