<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 static/models/buildings/PumpDefaultInternalVariant.gltf -s -k -P -t -u -r /models/buildings/
-->

<script context="module" lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf, useSuspense } from '@threlte/extras'

  type GLTFResult = {
    nodes: {
      Pump_Solid_LOD0: THREE.Mesh
      PumpGlas_LOD0: THREE.Mesh
      PumpRotate_LOD0: THREE.Mesh
    }
    materials: {}
  }

  const load = () => {
    const suspend = useSuspense()
    return suspend(useGltf<GLTFResult>('/models/buildings/PumpDefaultInternalVariant.gltf'))
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
      name="Pump_Solid_LOD0"
      castShadow
      receiveShadow
      geometry={gltf.nodes.Pump_Solid_LOD0.geometry}
      material={gltf.nodes.Pump_Solid_LOD0.material}
    />
    <T.Mesh
      name="PumpGlas_LOD0"
      castShadow
      receiveShadow
      geometry={gltf.nodes.PumpGlas_LOD0.geometry}
      material={gltf.nodes.PumpGlas_LOD0.material}
    />
    <T.Mesh
      name="PumpRotate_LOD0"
      castShadow
      receiveShadow
      geometry={gltf.nodes.PumpRotate_LOD0.geometry}
      material={gltf.nodes.PumpRotate_LOD0.material}
    />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
