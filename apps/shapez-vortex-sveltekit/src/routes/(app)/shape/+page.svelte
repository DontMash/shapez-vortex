<script lang="ts">
  import type { PageProps } from './$types';

  import { section } from '$lib/components/section';
  import ShapeView from '$lib/components/shape/ShapeView.svelte';

  let { data }: PageProps = $props();
</script>

<section class={section()}>
  <ShapeView
    data={data.shape}
    isExtended={data.extend}
    isExpanded={data.expand}
  />
</section>
