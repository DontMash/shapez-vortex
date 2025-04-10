<script lang="ts">
  import type { PageData } from './$types';

  import { section } from '$lib/components/section';
  import ShapeView from '$lib/components/shape/ShapeView.svelte';

  export let data: PageData;
</script>

<section class={section()}>
  <ShapeView
    data={data.shape}
    isExtended={data.extend}
    isExpanded={data.expand}
  />
</section>
