<script lang="ts">
	import { onMount } from 'svelte';

	import { ShapeViewer } from 'shapez-viewer';
	import { ToastType, add } from './toast/toast.service';

	import Loading from './Loading.svelte';

	export let shapeIdentifier: string | undefined;

	let isLoading: boolean = true;
	let viewer: ShapeViewer | undefined = undefined;
	let canvas: HTMLCanvasElement | undefined = undefined;

	$: {
		viewer
			?.init()
			.then(() => {
				viewer?.assign(shapeIdentifier);
				isLoading = false;
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
			if (import.meta.env.DEV) {
				console.error(error);
			}
			add(message, 2000, ToastType.Error);
		}
	});

	export const expandLayers = () => viewer?.expandLayers();
	export const collapseLayers = () => viewer?.collapseLayers();
	export const expandQuarters = () => viewer?.expandQuarters();
	export const collapseQuarters = () => viewer?.collapseQuarters();
</script>

<figure class="relative h-full w-full">
	{#if isLoading}
		<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<Loading />
		</div>
	{/if}
	<figcaption class="sr-only">{shapeIdentifier}</figcaption>
	<canvas bind:this={canvas} />
</figure>
