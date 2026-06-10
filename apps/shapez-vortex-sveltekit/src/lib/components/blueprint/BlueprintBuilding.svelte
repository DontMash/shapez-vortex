<script lang="ts">
  import type { BuildingInternalVariantId } from '@shapez-vortex/game-data';
  import { T } from '@threlte/core';
  import { Align, Suspense, Text3DGeometry } from '@threlte/extras';
  import {
    Color,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    Texture,
    TextureLoader,
    UniformsUtils,
    type IUniform,
    type Mesh,
  } from 'three';
  import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

  import type { BlueprintBuildingEntry } from '$lib/blueprint';
  import type { ThrelteVector3 } from '$lib/three';

  import COLOR_MAP from '$lib/assets/images/MaterialLUT.png';
  import BUILDING_VERTEXSHADER from '$lib/assets/shaders/building/building.vs?raw';
  import BUILDING_FRAGMENTSHADER from '$lib/assets/shaders/building/building.fs?raw';
  import { getBlueprintBuildingModel } from '$lib/components/blueprint/blueprint-building';

  const MIRRORED_BUILDING_KEY = 'Mirrored' as const;

  const textureLoader = new TextureLoader();
  textureLoader.loadAsync(COLOR_MAP).then((texture) => {
    const uniforms = { lutTexture: { value: texture } } satisfies Record<
      string,
      IUniform<Texture>
    >;
    BUILDING_MATERIAL.uniforms = UniformsUtils.merge([
      BUILDING_MATERIAL.uniforms,
      uniforms,
    ]);
  });
  const BUILDING_MATERIAL = new CustomShaderMaterial({
    baseMaterial: MeshStandardMaterial,
    vertexShader: BUILDING_VERTEXSHADER,
    fragmentShader: BUILDING_FRAGMENTSHADER,
    uniforms: {
      accentColor: { value: new Color(0xff9421) },
      emissive1Color: { value: new Color(0xf3b026) },
      emissive2Color: { value: new Color(0x576fd4) },
    },
  });
  const BUILDING_MATERIAL_GLASS = new MeshStandardMaterial({
    color: 0xdddddd,
    opacity: 0.3,
    transparent: true,
  });
  const BUILDING_MATERIAL_ERROR = new MeshBasicMaterial({ color: 0xff0000 });

  interface Props {
    entry: BlueprintBuildingEntry;
  }

  let { entry }: Props = $props();

  let ref: Object3D | undefined = $state();
  let buildingModel = $derived(getBlueprintBuildingModel(entry.T));

  const isMirrored = (type: BuildingInternalVariantId) =>
    type.toLowerCase().includes(MIRRORED_BUILDING_KEY.toLowerCase());
  const setMaterial = (entry: BlueprintBuildingEntry, object: Object3D) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const name = object.name.toLowerCase();
      if (name === 'error') {
        mesh.material = BUILDING_MATERIAL_ERROR;
      } else if (name.includes('glas')) {
        mesh.material = BUILDING_MATERIAL_GLASS;
      } else {
        mesh.material = BUILDING_MATERIAL;
      }
    }

    if (object.children.length <= 0) return;

    return object.children.forEach((child) => setMaterial(entry, child));
  };

  const onload = () => {
    if (!ref) {
      throw new Error('[BLUEPRINT_BUILDING] model not initialized');
    }

    setMaterial(entry, ref);
  };
</script>

<Suspense {onload}>
  {@const Building = buildingModel.layers
    ? buildingModel.layers[entry.L ?? 0]
    : buildingModel.base}
  {@const position = [
    entry.X ?? 0,
    entry.L ?? 0,
    entry.Y ?? 0,
  ] as ThrelteVector3}
  {@const rotationY =
    (entry.R ?? 0) * -0.5 * Math.PI + (isMirrored(entry.T) ? 0 : Math.PI)}
  <Building {position} rotation.y={rotationY} bind:ref />
  {#if entry.T === 'LabelDefaultInternalVariant'}
    {@const text = atob(String(entry.C)).trim().replace(/[\W_]/g, '')}
    <T.Mesh
      rotation.x={-0.5 * Math.PI}
      rotation.z={(entry.R ?? 0) * -0.5 * Math.PI}
      scale={0.0025}
    >
      <Text3DGeometry {text} depth={5} />
    </T.Mesh>
  {/if}
</Suspense>
