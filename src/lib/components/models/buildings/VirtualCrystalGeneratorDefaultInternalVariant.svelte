<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 static/models/buildings/VirtualCrystalGeneratorDefaultInternalVariant.gltf -s -k -P -t -u -r /models/buildings/
-->

<script context="module" lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf, useSuspense } from '@threlte/extras'

  type GLTFResult = {
    nodes: {
      Wire_IOConnector_Output_LOD0001: THREE.Mesh
      Wire_IOConnector_Input_LOD0001: THREE.Mesh
      VirtualTopMostPainter_Main_LOD0001: THREE.Mesh
      Wire_IOConnector_Input_LOD0002: THREE.Mesh
    }
    materials: {}
  }

  const load = () => {
    const suspend = useSuspense()
    return suspend(useGltf<GLTFResult>('/models/buildings/VirtualCrystalGeneratorDefaultInternalVariant.gltf'))
  }

  export const preload = async () => {
    await load()
  }
</script>

<script lang="ts">
  type $$Props = Props<THREE.Group>
  type $$Events = Events<THREE.Group>
  type $$Slots = Slots<THREE.Group> & { fallback: {}; error: { error: any } }

  export const ref = new Group()

  const gltf = load()

  const component = forwardEventHandlers()
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Mesh
      name="Wire_IOConnector_Output_LOD0001"
      castShadow
      receiveShadow
      geometry={gltf.nodes.Wire_IOConnector_Output_LOD0001.geometry}
      material={gltf.nodes.Wire_IOConnector_Output_LOD0001.material}
      position={[-1, 0, 0]}
    />
    <T.Mesh
      name="Wire_IOConnector_Input_LOD0001"
      castShadow
      receiveShadow
      geometry={gltf.nodes.Wire_IOConnector_Input_LOD0001.geometry}
      material={gltf.nodes.Wire_IOConnector_Input_LOD0001.material}
      position={[1, 0, 0]}
      rotation={[Math.PI, 0, Math.PI]}
    />
    <T.Mesh
      name="VirtualTopMostPainter_Main_LOD0001"
      castShadow
      receiveShadow
      geometry={gltf.nodes.VirtualTopMostPainter_Main_LOD0001.geometry}
      material={gltf.nodes.VirtualTopMostPainter_Main_LOD0001.material}
    />
    <T.Mesh
      name="Wire_IOConnector_Input_LOD0002"
      castShadow
      receiveShadow
      geometry={gltf.nodes.Wire_IOConnector_Input_LOD0002.geometry}
      material={gltf.nodes.Wire_IOConnector_Input_LOD0002.material}
      position={[0, 0, 1]}
      rotation={[0, Math.PI / 2, 0]}
    />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
