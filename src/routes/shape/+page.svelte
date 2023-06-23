<script lang="ts">
	import type { PageData } from './$types';

	import Visualizer from '$lib/components/Viewer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';

	export let data: PageData;

	let visualizer: Visualizer;
	const toggleLayers = (value: boolean) =>
		value ? visualizer?.expandLayers() : visualizer?.collapseLayers();
	const toggleQuarters = (value: boolean) =>
		value ? visualizer?.expandQuarters() : visualizer?.collapseQuarters();
</script>

<section class="relative mx-auto h-screen w-full max-w-5xl">
	<div class="relative z-10 mt-8 flex flex-col items-center space-y-2">
		<Navigation input={data.shape?.identifier ?? ''} />
		<div class="flex border-2 border-neutral-900 divide-x-2 divide-neutral-900">
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
		<Visualizer shapeIdentifier={data.shape?.identifier} bind:this={visualizer} />
	</figure>
</section>
