<script lang="ts">
	import { view } from '$lib/client/shapes';
	import { fullscreen } from '$lib/client/fullscreen';
	import type { ShapeData } from '$lib/shape.types';

	import Loading from '$lib/components/Loading.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;

	let viewer: HTMLElement;
	let isLoading = true;
	let isFullscreen = false;
</script>

<figure class="relative" bind:this={viewer}>
	<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center p-4">
		<div
			class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-4xl border-2 border-neutral-800"
		>
			<form class="group" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={!isExtended} />
				<input name="expand" type="hidden" value={isExpanded} />
				<button
					class="h-14 w-14 cursor-pointer bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:pl-3 group-first:pr-1 group-last:pl-1 group-last:pr-3"
					type="submit"
				>
					<span class="sr-only"> Extend all layers </span>
					{#if isExtended}
						<LayersIcon />
					{:else}
						<LayersFilledIcon />
					{/if}
				</button>
			</form>
			<form class="group" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={isExtended} />
				<input name="expand" type="hidden" value={!isExpanded} />
				<button
					class="h-14 w-14 cursor-pointer bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:pl-3 group-first:pr-1 group-last:pl-1 group-last:pr-3"
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
			<button
				class="h-14 w-14 cursor-pointer bg-stone-200 fill-neutral-900 p-2 first:pl-3 first:pr-1 last:pl-1 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
				type="button"
				use:fullscreen={{ fullscreenElement: viewer }}
				on:change={(event) => (isFullscreen = event.detail)}
			>
				<span class="sr-only">Turn fullscreen {isFullscreen ? 'off' : 'on'}</span>
				{#if !isFullscreen}
					<FullscreenIcon />
				{:else}
					<FullscreenExitIcon />
				{/if}
			</button>
			<form class="group" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<button
					class="h-14 w-14 cursor-pointer bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:pl-3 group-first:pr-1 group-last:pl-1 group-last:pr-3"
					type="submit"
				>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</form>
		</div>
	</div>
	<div class="aspect-h-3 aspect-w-4">
		<canvas
			class="bg-neutral-900 outline-none data-[loading=true]:pointer-events-none"
			tabindex="-1"
			data-loading={isLoading}
			use:view={{ data, isExtended, isExpanded }}
			on:load={() => (isLoading = false)}
		/>
	</div>
	{#if isLoading}
		<div
			class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
		>
			<Loading />
		</div>
	{/if}
	<figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
