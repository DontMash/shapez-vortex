<script lang="ts">
	import type { PageData } from './$types';

	import Viewer from '$lib/components/ShapeViewer.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';

	export let data: PageData;

	let viewer: Viewer;
	const toggleLayers = (value: boolean) =>
		value ? viewer?.expandLayers() : viewer?.collapseLayers();
	const toggleQuarters = (value: boolean) =>
		value ? viewer?.expandQuarters() : viewer?.collapseQuarters();
</script>

<svelte:head>
	<title>Shapez Viewer</title>
</svelte:head>

<h1 class="sr-only">Shapez Viewer</h1>

<section class="relative mx-auto h-[48rem] w-full max-w-5xl">
	<div class="flex relative z-10 justify-center">
		<div class="flex divide-x-2 divide-neutral-900 border-2 border-neutral-900">
			<Toggle
				id="expandLayers"
				label="Expand all layers"
				on:change={(event) => toggleLayers(event.detail)}
			>
				<svelte:fragment slot="checked">
					<LayersIcon />
				</svelte:fragment>
				<svelte:fragment slot="unchecked">
					<LayersFilledIcon />
				</svelte:fragment>
			</Toggle>
			<Toggle
				id="expandQuarters"
				label="Expand all quarters"
				on:change={(event) => toggleQuarters(event.detail)}
			>
				<svelte:fragment slot="checked">
					<LayersClearIcon />
				</svelte:fragment>
				<svelte:fragment slot="unchecked">
					<LayersClearFilledIcon />
				</svelte:fragment>
			</Toggle>
		</div>
	</div>
	<figure class="absolute left-0 top-0 h-full w-full">
		<Viewer shapeIdentifier={data.shape?.identifier} bind:this={viewer} />
	</figure>
</section>
