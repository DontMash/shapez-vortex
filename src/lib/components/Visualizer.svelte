<script lang="ts">
	import { onMount } from 'svelte';

	import { ShapeVisualizer } from '$lib/ShapeVisualizer';
	import { ToastType, add } from './toast/toast.service';

	export let shapeIdentifier: string;

	let visualizer: ShapeVisualizer | undefined = undefined;
	let canvas: HTMLCanvasElement | undefined = undefined;

	$: {
		visualizer?.draw(shapeIdentifier).catch((reason) => {
			const error = reason as Error;
			if (import.meta.env.DEV) {
				console.error(error);
			}
			add(error.message, 2000, ToastType.Error);
		});
	}

	onMount(() => {
		if (!canvas) {
			console.warn('Canvas not provided');
			return;
		}

		try {
			visualizer = new ShapeVisualizer(canvas);
		} catch (error) {
			const message = (error as Error).message;
			console.error(error);
			add(message, 2000, ToastType.Error);
		}
	});
</script>

<canvas bind:this={canvas} />
