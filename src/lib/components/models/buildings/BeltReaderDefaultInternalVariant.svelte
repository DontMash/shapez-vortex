<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 static/models/buildings/BeltReaderDefaultInternalVariant.gltf -s -k -P -t -u -r /models/buildings/
-->

<script context="module" lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf, useSuspense } from '@threlte/extras'

  type GLTFResult = {
    nodes: {
      Wire_IOConnector_Output_LOD0: THREE.Mesh
      BeltReader: THREE.Mesh
      BeltReaderPlattform: THREE.Mesh
      BeltReaderLoading: THREE.Mesh
    }
    materials: {}
  }

  const load = () => {
    const suspend = useSuspense()
    return suspend(useGltf<GLTFResult>('/models/buildings/BeltReaderDefaultInternalVariant.gltf'))
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
      name="Wire_IOConnector_Output_LOD0"
      castShadow
      receiveShadow
      geometry={gltf.nodes.Wire_IOConnector_Output_LOD0.geometry}
      material={gltf.nodes.Wire_IOConnector_Output_LOD0.material}
      position={[0, 0, -1]}
      rotation={[0, -Math.PI / 2, 0]}
    />
    <T.Mesh
      name="BeltReader"
      castShadow
      receiveShadow
      geometry={gltf.nodes.BeltReader.geometry}
      material={gltf.nodes.BeltReader.material}
    />
    <T.Mesh
      name="BeltReaderPlattform"
      castShadow
      receiveShadow
      geometry={gltf.nodes.BeltReaderPlattform.geometry}
      material={gltf.nodes.BeltReaderPlattform.material}
    />
    <T.Mesh
      name="BeltReaderLoading"
      castShadow
      receiveShadow
      geometry={gltf.nodes.BeltReaderLoading.geometry}
      material={gltf.nodes.BeltReaderLoading.material}
      position={[0, 0.55, 0]}
    />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
