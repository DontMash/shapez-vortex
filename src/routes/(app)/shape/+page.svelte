<script lang="ts">
	import type { PageData } from './$types';

	import ShapeViewer from '$lib/components/shape/ShapeViewer.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<ShapeViewer
		data={data.shape}
		isExtended={data.extend}
		isExpanded={data.expand}
	/>
</section>
