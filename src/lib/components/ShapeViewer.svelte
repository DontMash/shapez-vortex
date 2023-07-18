<script lang="ts">
	import { onMount } from 'svelte';

	import { ShapeViewer } from 'shapez-viewer';
	import { ToastType, add } from './toast/toast.service';

	export let shapeIdentifier: string | undefined;

	let viewer: ShapeViewer | undefined = undefined;
	let canvas: HTMLCanvasElement | undefined = undefined;

	$: {
		viewer
			?.init()
			.then(() => {
				viewer?.draw(shapeIdentifier);
			})
			.catch((reason) => {
				const error = reason as Error;
				if (import.meta.env.DEV) {
					console.error(error);
				}
				add(error.message, 2000, ToastType.Error);
			});
	}

	onMount(() => {
		if (!canvas) {
			return console.warn('Canvas not provided');
		}

		try {
			viewer = new ShapeViewer(canvas);
		} catch (error) {
			const message = (error as Error).message;
			console.error(error);
			add(message, 2000, ToastType.Error);
		}
	});

	export const expandLayers = () => viewer?.expandLayers();
	export const collapseLayers = () => viewer?.collapseLayers();
	export const expandQuarters = () => viewer?.expandQuarters();
	export const collapseQuarters = () => viewer?.collapseQuarters();
</script>

<canvas bind:this={canvas} />
