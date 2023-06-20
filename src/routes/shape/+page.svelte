<script lang="ts">
	import type { PageData } from './$types';

	import Visualizer from '$lib/components/Visualizer.svelte';
	import ShapeInput from '$lib/components/ShapeInput.svelte';

	export let data: PageData;
</script>

<section class="relative mx-auto h-screen w-full max-w-5xl">
	{#if data.shape}
		<figure class="absolute left-0 top-0 h-full w-full">
			<Visualizer shapeIdentifier={data.shape.identifier} />
		</figure>
	{/if}
	<div class="relative z-10 flex flex-col items-center mt-8">
		<ShapeInput />
	</div>
</section>
