<script lang="ts">
	import type { PageData } from './$types';

	import Viewer from '$lib/components/ShapeViewer.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	let viewer: Viewer;
	let shapeIdentifier: string | undefined;
	let isExtended: boolean = false;
	let isExpanded: boolean = false;
	$: {
		shapeIdentifier = data.shape?.identifier;
		isExtended = data.shape?.extend;
		isExpanded = data.shape?.expand;

		toggleLayers(isExtended);
		toggleQuarters(isExpanded);
	}
	const toggleLayers = (value: boolean) =>
		value ? viewer?.expandLayers() : viewer?.collapseLayers();
	const toggleQuarters = (value: boolean) =>
		value ? viewer?.expandQuarters() : viewer?.collapseQuarters();

	onMount(() => {
		toggleLayers(isExtended);
		toggleQuarters(isExpanded);
	});
</script>

<section class="relative mx-auto h-[48rem] w-full max-w-5xl">
	<div class="relative z-10 flex justify-center">
		<div class="flex divide-x-2 divide-neutral-900 border-2 border-neutral-900">
			<form method="GET" action="/shape">
				{#if shapeIdentifier}
					<input name="identifier" type="hidden" value={shapeIdentifier} />
				{/if}
				<input name="extend" type="hidden" value={!isExtended} />
				<input name="expand" type="hidden" value={isExpanded} />
				<button
					class="h-12 w-12 cursor-pointer bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					type="submit"
				>
					<span class="sr-only"> Expand all layers </span>
					{#if isExtended}
						<LayersIcon />
					{:else}
						<LayersFilledIcon />
					{/if}
				</button>
			</form>
			<form method="GET" action="/shape">
				{#if shapeIdentifier}
					<input name="identifier" type="hidden" value={shapeIdentifier} />
				{/if}
				<input name="extend" type="hidden" value={isExtended} />
				<input name="expand" type="hidden" value={!isExpanded} />
				<button
					class="h-12 w-12 cursor-pointer bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					type="submit"
				>
					<span class="sr-only"> Expand all quarters </span>
					{#if isExpanded}
						<LayersClearIcon />
					{:else}
						<LayersClearFilledIcon />
					{/if}
				</button>
			</form>
		</div>
	</div>
	<div class="absolute left-0 top-0 h-full w-full">
		<Viewer {shapeIdentifier} bind:this={viewer} />
	</div>
</section>
