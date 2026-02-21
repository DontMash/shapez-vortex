<script lang="ts">
  import { ShapeDefaultSupport } from '@shapez-vortex/models';
  import { Canvas, T } from '@threlte/core';
  import { OrbitControls, Suspense } from '@threlte/extras';
  import {
    Group,
    MeshStandardMaterial,
    NoToneMapping,
    WebGLRenderer,
    type Mesh,
  } from 'three';
  import type { OrbitControls as OrbitControlsType } from 'three/addons/controls/OrbitControls.js';

  import type { ThrelteVector3 } from '$lib/three';
  import {
    isDefaultShapeIdentifier,
    SHAPE_MAX_LAYERS,
    type ShapeData,
  } from '$lib/shape';

  import ShapePart from './ShapePart.svelte';

  const SHAPE_LAYER_HEIGHT = 0.05;
  const SHAPE_LAYER_SCALE = 1 / SHAPE_MAX_LAYERS;
  const SHAPE_LAYER_EXTEND_OFFSET = 0.15;
  const SHAPE_PART_EXPAND_OFFSET = 0.4;
  const SHAPE_CAMERA_START_POSITION: ThrelteVector3 = [0, 0, 1.5];
  const SHAPE_COLOR_BASE = 0x333333;
  const SHAPE_COLOR_BASE_MATERIAL = new MeshStandardMaterial({
    name: 'BASE_MATERIAL',
    color: SHAPE_COLOR_BASE,
    roughness: 0.8,
    metalness: 0.3,
  });

  interface Props {
    data: ShapeData;
    isExtended?: boolean;
    isExpanded?: boolean;
    orbitControls?: OrbitControlsType | undefined;
    canvasElement?: HTMLCanvasElement | undefined;
  }

  let {
    data,
    isExtended = false,
    isExpanded = false,
    orbitControls = $bindable(),
    canvasElement = $bindable(),
  }: Props = $props();

  let isHex = $derived(!isDefaultShapeIdentifier(data.identifier));
  let baseComponentModel: Group | undefined = $state();

  const onBaseModelLoad = () => {
    if (!baseComponentModel) {
      throw new Error('[SHAPEVIEW] model not initialized');
    }

    const object = baseComponentModel;
    const mesh = object.children[0] as Mesh;
    mesh.material = SHAPE_COLOR_BASE_MATERIAL;
  };
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
      <ShapeDefaultSupport position.y={-0.025} bind:ref={baseComponentModel} />
    </Suspense>
    {#key data}
      {#each data.data.slice(0, SHAPE_MAX_LAYERS) as layer, layerIndex (layerIndex)}
        {@const layerPositionY = layerIndex * SHAPE_LAYER_HEIGHT}
        {@const layerScale = 1 - layerIndex * SHAPE_LAYER_SCALE}
        {@const extendOffset = isExtended
          ? layerIndex * SHAPE_LAYER_EXTEND_OFFSET
          : 0}
        {@const expandOffset = isExpanded ? SHAPE_PART_EXPAND_OFFSET : 0}
        <T.Group
          position.y={layerPositionY + extendOffset}
          scale={[layerScale, 0.5, layerScale]}
        >
          {#each layer as part, partIndex (partIndex)}
            <T.Group
              rotation.y={partIndex * (isHex ? -1 / 3 : -0.5) * Math.PI +
                Math.PI}
            >
              <ShapePart
                data={part}
                {isHex}
                offset={expandOffset * SHAPE_LAYER_SCALE * (layerIndex + 1)}
              />
            </T.Group>
          {/each}
        </T.Group>
      {/each}
    {/key}
  </T.Group>
</Canvas>
