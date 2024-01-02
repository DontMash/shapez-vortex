<script lang="ts">
	import { view } from '$lib/client/shapes';
	import type { ShapeData } from '$lib/shape.types';

	import Loading from '$lib/components/Loading.svelte';

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;

	let isLoading = true;
</script>

<figure class="aspect-h-3 aspect-w-4">
	<canvas
		class="outline-none data-[loading=true]:pointer-events-none"
		tabindex="-1"
		data-loading={isLoading}
		use:view={{ data, isExtended, isExpanded }}
		on:load={() => (isLoading = false)}
	/>
	{#if isLoading}
		<div
			class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
		>
			<Loading />
		</div>
	{/if}
	<figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
