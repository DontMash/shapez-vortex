<script lang="ts">
  import type { Component } from 'svelte';
  import { Mesh, Object3D } from 'three';
  import { Suspense } from '@threlte/extras';
  import {
    SHAPE_COLOR_MATERIALS,
    SHAPE_CRYSTAL_MATERIALS,
    type ShapePartData,
    type ShapeTypeIdentifier,
  } from '$lib/shape.types';

  import ShapeDefaultC from '$lib/components/models/shapes/ShapeDefaultC.svelte';
  import ShapeDefaultR from '$lib/components/models/shapes/ShapeDefaultR.svelte';
  import ShapeDefaultS from '$lib/components/models/shapes/ShapeDefaultS.svelte';
  import ShapeDefaultW from '$lib/components/models/shapes/ShapeDefaultW.svelte';
  import ShapeDefaultP from '$lib/components/models/shapes/ShapeDefaultP.svelte';
  import ShapeHexF from '$lib/components/models/shapes/ShapeHexF.svelte';
  import ShapeHexG from '$lib/components/models/shapes/ShapeHexG.svelte';
  import ShapeHexH from '$lib/components/models/shapes/ShapeHexH.svelte';
  import ShapeHexP from '$lib/components/models/shapes/ShapeHexP.svelte';

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
