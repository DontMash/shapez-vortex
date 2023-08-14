<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { ShapeRenderer, ShapeView } from 'shapez-viewer';

	export let data: PageData;
	let canvas: HTMLCanvasElement | undefined = undefined;

	onMount(() => {
		if (!canvas) {
			return console.warn('Canvas not provided');
		}

		const size = 256;
		const renderer = new ShapeRenderer(canvas, size, size);
		const view = new ShapeView(data.shape.identifier);
		view
			.init()
			.then(() => {
				renderer.update([view]);
			})
			.catch(console.error);
	});
</script>

<section class="flex h-screen items-center justify-center">
	<canvas bind:this={canvas} />
</section>
