<script lang="ts">
	import type { PageData } from './$types';

	import ShapeView from '$lib/components/shape/ShapeView.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-3xl">
	<ShapeView data={data.shape} isExtended={data.extend} isExpanded={data.expand} />
</section>
