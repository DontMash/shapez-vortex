<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 static/models/buildings/MixerDefaultInternalVariant.gltf -s -k -P -t -u -r /models/buildings/
-->

<script context="module" lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf, useSuspense } from '@threlte/extras'

  type GLTFResult = {
    nodes: {
      MixerFoundation: THREE.Mesh
      MixerGlas: THREE.Mesh
      MixerRotator: THREE.Mesh
    }
    materials: {}
  }

  const load = () => {
    const suspend = useSuspense()
    return suspend(useGltf<GLTFResult>('/models/buildings/MixerDefaultInternalVariant.gltf'))
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
      name="MixerFoundation"
      castShadow
      receiveShadow
      geometry={gltf.nodes.MixerFoundation.geometry}
      material={gltf.nodes.MixerFoundation.material}
      position={[0, 0.07, 0]}
    />
    <T.Mesh
      name="MixerGlas"
      castShadow
      receiveShadow
      geometry={gltf.nodes.MixerGlas.geometry}
      material={gltf.nodes.MixerGlas.material}
      position={[0, 0.07, -0.02]}
    />
    <T.Mesh
      name="MixerRotator"
      castShadow
      receiveShadow
      geometry={gltf.nodes.MixerRotator.geometry}
      material={gltf.nodes.MixerRotator.material}
      position={[-1, 0.09, 0.52]}
    />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
