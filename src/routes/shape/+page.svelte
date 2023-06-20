<script lang="ts">
	import type { PageData } from './$types';

	import Visualizer from '$lib/components/Visualizer.svelte';
	import ShapeInput from '$lib/components/ShapeInput.svelte';

	export let data: PageData;
</script>

<section class="relative mx-auto h-screen w-full max-w-5xl">
	<div class="relative z-10 mt-8 flex flex-col items-center">
		<ShapeInput />
		{#if data.shape}
			<i class="text-stone-700">{data.shape.identifier}</i>
		{/if}
	</div>
	<figure class="absolute left-0 top-0 h-full w-full">
		<Visualizer shapeIdentifier={data.shape?.identifier} />
	</figure>
</section>
