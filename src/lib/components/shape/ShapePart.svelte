<script lang="ts">
  import type { Component } from 'svelte';
  import { Material, Mesh, MeshStandardMaterial, Object3D } from 'three';
  import { Suspense } from '@threlte/extras';
  import {
    type ShapeColorIdentifier,
    type ShapePartData,
    type ShapeTypeIdentifier,
  } from '$lib/shape';

  import ShapeDefaultC from '$lib/components/models/shapes/ShapeDefaultC.svelte';
  import ShapeDefaultR from '$lib/components/models/shapes/ShapeDefaultR.svelte';
  import ShapeDefaultS from '$lib/components/models/shapes/ShapeDefaultS.svelte';
  import ShapeDefaultW from '$lib/components/models/shapes/ShapeDefaultW.svelte';
  import ShapeDefaultP from '$lib/components/models/shapes/ShapeDefaultP.svelte';
  import ShapeHexF from '$lib/components/models/shapes/ShapeHexF.svelte';
  import ShapeHexG from '$lib/components/models/shapes/ShapeHexG.svelte';
  import ShapeHexH from '$lib/components/models/shapes/ShapeHexH.svelte';
  import ShapeHexP from '$lib/components/models/shapes/ShapeHexP.svelte';

  const SHAPE_COLOR_NONE = 0x777777;
  const SHAPE_COLOR_PIN = 0x444450;
  const SHAPE_COLOR_RED = 0xee3333;
  const SHAPE_COLOR_GREEN = 0x00ee00;
  const SHAPE_COLOR_BLUE = 0x0000ee;
  const SHAPE_COLOR_CYAN = 0x00eeee;
  const SHAPE_COLOR_PURPLE = 0xcc00cc;
  const SHAPE_COLOR_YELLOW = 0xeeee00;
  const SHAPE_COLOR_BLACK = 0x141414;
  const SHAPE_COLOR_WHITE = 0xfafafa;

  const SHAPE_COLOR_MATERIAL_OPTIONS = {
    vertexColors: true,
    roughness: 0.7,
    metalness: 0.1,
  };
  const SHAPE_COLOR_NONE_MATERIAL = new MeshStandardMaterial({
    name: 'NONE_MATERIAL',
    color: SHAPE_COLOR_NONE,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_PIN_MATERIAL = new MeshStandardMaterial({
    name: 'PIN_MATERIAL',
    color: SHAPE_COLOR_PIN,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_RED_MATERIAL = new MeshStandardMaterial({
    name: 'RED_MATERIAL',
    color: SHAPE_COLOR_RED,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_GREEN_MATERIAL = new MeshStandardMaterial({
    name: 'GREEN_MATERIAL',
    color: SHAPE_COLOR_GREEN,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_BLUE_MATERIAL = new MeshStandardMaterial({
    name: 'BLUE_MATERIAL',
    color: SHAPE_COLOR_BLUE,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_CYAN_MATERIAL = new MeshStandardMaterial({
    name: 'CYAN_MATERIAL',
    color: SHAPE_COLOR_CYAN,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_PURPLE_MATERIAL = new MeshStandardMaterial({
    name: 'PURPLE_MATERIAL',
    color: SHAPE_COLOR_PURPLE,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_YELLOW_MATERIAL = new MeshStandardMaterial({
    name: 'YELLOW_MATERIAL',
    color: SHAPE_COLOR_YELLOW,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_BLACK_MATERIAL = new MeshStandardMaterial({
    name: 'BLACK_MATERIAL',
    color: SHAPE_COLOR_BLACK,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_WHITE_MATERIAL = new MeshStandardMaterial({
    name: 'WHITE_MATERIAL',
    color: SHAPE_COLOR_WHITE,
    ...SHAPE_COLOR_MATERIAL_OPTIONS,
  });
  const SHAPE_COLOR_MATERIALS: Record<ShapeColorIdentifier, Material> = {
    r: SHAPE_COLOR_RED_MATERIAL,
    g: SHAPE_COLOR_GREEN_MATERIAL,
    b: SHAPE_COLOR_BLUE_MATERIAL,
    c: SHAPE_COLOR_CYAN_MATERIAL,
    m: SHAPE_COLOR_PURPLE_MATERIAL,
    y: SHAPE_COLOR_YELLOW_MATERIAL,
    k: SHAPE_COLOR_BLACK_MATERIAL,
    w: SHAPE_COLOR_WHITE_MATERIAL,
    u: SHAPE_COLOR_NONE_MATERIAL,
    '-': SHAPE_COLOR_PIN_MATERIAL,
  };

  const SHAPE_CRYSTAL_MATERIAL_OPTIONS = {
    roughness: 0.2,
    metalness: 0.6,
  };
  const SHAPE_CRYSTAL_NONE_MATERIAL = new MeshStandardMaterial({
    name: 'NONE_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_NONE,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_RED_MATERIAL = new MeshStandardMaterial({
    name: 'RED_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_RED,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_GREEN_MATERIAL = new MeshStandardMaterial({
    name: 'GREEN_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_GREEN,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_BLUE_MATERIAL = new MeshStandardMaterial({
    name: 'BLUE_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_BLUE,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_CYAN_MATERIAL = new MeshStandardMaterial({
    name: 'CYAN_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_CYAN,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_PURPLE_MATERIAL = new MeshStandardMaterial({
    name: 'PURPLE_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_PURPLE,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_YELLOW_MATERIAL = new MeshStandardMaterial({
    name: 'YELLOW_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_YELLOW,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_BLACK_MATERIAL = new MeshStandardMaterial({
    name: 'BLACK_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_BLACK,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_WHITE_MATERIAL = new MeshStandardMaterial({
    name: 'WHITE_CRYSTAL_MATERIAL',
    color: SHAPE_COLOR_WHITE,
    ...SHAPE_CRYSTAL_MATERIAL_OPTIONS,
  });
  const SHAPE_CRYSTAL_MATERIALS: Record<ShapeColorIdentifier, Material> = {
    r: SHAPE_CRYSTAL_RED_MATERIAL,
    g: SHAPE_CRYSTAL_GREEN_MATERIAL,
    b: SHAPE_CRYSTAL_BLUE_MATERIAL,
    c: SHAPE_CRYSTAL_CYAN_MATERIAL,
    m: SHAPE_CRYSTAL_PURPLE_MATERIAL,
    y: SHAPE_CRYSTAL_YELLOW_MATERIAL,
    k: SHAPE_CRYSTAL_BLACK_MATERIAL,
    w: SHAPE_CRYSTAL_WHITE_MATERIAL,
    u: SHAPE_CRYSTAL_NONE_MATERIAL,
    '-': SHAPE_COLOR_NONE_MATERIAL,
  };

  const SHAPE_PART_BASE_OFFSET = 0.025;

  interface Props {
    data: ShapePartData;
    isHex?: boolean;
    offset?: number;
  }

  let { data, isHex = false, offset = 0 }: Props = $props();

  let ref: Object3D | undefined = $state();

  const getShapePart = (type: ShapeTypeIdentifier): Component | undefined => {
    switch (type) {
      case 'C':
        return ShapeDefaultC;
      case 'R':
        return ShapeDefaultR;
      case 'S':
        return ShapeDefaultS;
      case 'W':
        return ShapeDefaultW;

      case 'F':
        return ShapeHexF;
      case 'G':
        return ShapeHexG;
      case 'H':
        return ShapeHexH;

      case 'P':
        return isHex ? ShapeHexP : ShapeDefaultP;
      case 'c':
        return isHex ? ShapeHexH : ShapeDefaultC;
      case '-':
        return undefined;
    }
  };
  const setMaterial = (object: Object3D) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const material =
        data.type === 'c'
          ? SHAPE_CRYSTAL_MATERIALS[data.color]
          : SHAPE_COLOR_MATERIALS[data.color];
      mesh.material = material;
    }
    if (object.children.length <= 0) return;

    return object.children.forEach((child) => setMaterial(child));
  };

  const onload = () => {
    if (!ref) {
      throw new Error('[SHAPEPART] model not initialized');
    }
    setMaterial(ref);
  };
</script>

<Suspense {onload}>
  {@const Shape = getShapePart(data.type)}
  <Shape
    position={[
      -SHAPE_PART_BASE_OFFSET - offset,
      0,
      SHAPE_PART_BASE_OFFSET + offset,
    ]}
    bind:ref
  />
</Suspense>
