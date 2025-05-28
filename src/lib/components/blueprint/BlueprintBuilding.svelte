<script lang="ts">
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
  import { Suspense } from '@threlte/extras';
  import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
  import type {
    BlueprintBuildingEntry,
    BlueprintBuildingIdentifier,
  } from '$lib/blueprint.types';

  import COLOR_MAP from '$lib/assets/images/MaterialLUT.png';
  import BUILDING_VERTEXSHADER from '$lib/assets/shaders/building/building.vs?raw';
  import BUILDING_FRAGMENTSHADER from '$lib/assets/shaders/building/building.fs?raw';
  import { getBlueprintBuildingModel } from '$lib/components/blueprint/blueprint-building';

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

  export const MIRRORED_BUILDINGS = [
    'BeltDefaultRightInternalVariant',
    'Splitter1To2RInternalVariant',
    'Merger2To1RInternalVariant',
    'Lift1UpRightInternalVariant',
    'Lift1DownRightInternalVariant',
    'Lift2UpRightInternalVariant',
    'Lift2DownRightInternalVariant',
    'PipeRightInternalVariant',
    'PipeUpRightInternalVariant',
    'Pipe2UpRightInternalVariant',
    'WireDefaultRightInternalVariant',
    'WireDefault1UpRightInternalVariant',
    'WireDefault2UpRightInternalVariant',
    'CutterMirroredInternalVariant',
  ];
  const isMirrored = (type: BlueprintBuildingIdentifier) => {
    return (
      type.toLowerCase().includes('mirrored') ||
      MIRRORED_BUILDINGS.includes(type)
    );
  };
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

    switch (entry.T) {
      case 'LabelDefaultInternalVariant': {
        ref.children.forEach((child, index) => (child.visible = index === 0));
        const text = atob(String(entry.C))
          .trim()
          .replace(/[\W_]/g, '')
          .toUpperCase();
        const LETTER_SPACING = 0.525;
        [...text].forEach((char, index, array) => {
          if (!ref) {
            throw new Error('[BLUEPRINT_BUILDING] letters not initialized');
          }
          const letterIndex = char.charCodeAt(0) - 65;
          const letterModel = ref.children.at(letterIndex + 1);
          if (!letterModel) {
            throw new Error(
              `[BLUEPRINT_BUILDING] letter not available: ${letterIndex}`,
            );
          }
          const letter = letterModel.clone();
          if (array.length > 8) {
            const scale = (1 / array.length) * 8;
            letter.translateX(index * scale * LETTER_SPACING * -1);
            letter.scale.set(scale, 1, scale);
          } else {
            letter.translateX(index * LETTER_SPACING * -1);
          }
          letter.visible = true;
          ref.add(letter);
        });
      }
    }
  };
</script>

<Suspense {onload}>
  {@const Building = buildingModel.layers
    ? buildingModel.layers[entry.L ?? 0]
    : buildingModel.base}
  <Building
    position={[entry.X ?? 0, entry.L ?? 0, entry.Y ?? 0]}
    rotation.y={(entry.R ?? 0) * -0.5 * Math.PI + Math.PI}
    scale.z={isMirrored(entry.T) ? -1 : 1}
    bind:ref
  />
</Suspense>
