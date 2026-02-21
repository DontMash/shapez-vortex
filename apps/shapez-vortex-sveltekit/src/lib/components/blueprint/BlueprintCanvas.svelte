<script lang="ts">
  import { Canvas, T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { MOUSE, NoToneMapping, WebGLRenderer } from 'three';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';
  import type { Blueprint, BlueprintIslandEntry } from '$lib/blueprint';

  import BlueprintBuilding from './BlueprintBuilding.svelte';

  const BLUEPRINT_GRID_SIZE = 1001;
  const BLUEPRINT_GRID_COLOR = 0x444444;

  const BLUEPRINT_ISLAND_PADDING_SIZE = 3;
  const BLUEPRINT_ISLAND_GAP_SIZE = BLUEPRINT_ISLAND_PADDING_SIZE * 2;
  const BLUEPRINT_ISLAND_MIN_SIZE = 12;
  const BLUEPRINT_ISLAND_LAYOUT_UNIT =
    BLUEPRINT_ISLAND_MIN_SIZE + BLUEPRINT_ISLAND_GAP_SIZE;

  interface Props {
    blueprint: Blueprint | undefined;
    zoom?: boolean;
    orbitControls?: OrbitControlsType | undefined;
    canvasElement?: HTMLCanvasElement | undefined;
  }

  let {
    blueprint,
    zoom = true,
    orbitControls = $bindable(),
    canvasElement = $bindable(),
  }: Props = $props();

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
</script>

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
      enableZoom={zoom}
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
