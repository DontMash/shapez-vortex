<script lang="ts">
	import { onMount } from 'svelte';
	import type { ShapeData } from '$lib/shape.types';
	import { view } from '$lib/client/shapes';
	import { create } from '$lib/client/user/database';
	import { copy } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';

	import Loading from '$lib/components/Loading.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkIcon.svelte';
	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';
	import ShuffleIcon from '$lib/components/icons/ShuffleIcon.svelte';

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;

	let viewer: HTMLElement;
	let isLoading = true;
	let isFullscreen = false;
	let isBookmark = false;

	async function onBookmark() {
		const { shape } = await create();
		const { add, remove } = shape;

		if (isBookmark) {
			await remove(data.identifier);
		} else {
			await add(data);
		}
		await updateBookmark();
	}
	async function updateBookmark() {
		const { shape } = await create();
		const { has } = shape;

		isBookmark = await has(data.identifier);
	}

	onMount(async () => {
		await updateBookmark();
	});
</script>

<figure class="relative" bind:this={viewer}>
	<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center space-x-4 p-4">
		<div
			class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
		>
			<form class="group" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={!isExtended} />
				<input name="expand" type="hidden" value={isExpanded} />
				<button
					class="inline-flex h-14 w-14 items-center justify-center bg-stone-200 fill-neutral-900 p-3 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					title="Extend layers"
					type="submit"
				>
					<span class="sr-only">Extend layers</span>
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
					class="inline-flex h-14 w-14 items-center justify-center bg-stone-200 fill-neutral-900 p-3 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					title="Expand quarters"
					type="submit"
				>
					<span class="sr-only">Expand quarters</span>
					{#if isExpanded}
						<LayersClearIcon />
					{:else}
						<LayersClearFilledIcon />
					{/if}
				</button>
			</form>
			<form class="group" method="post" action="/shape/?/random">
				<button
					class="inline-flex h-14 w-14 items-center justify-center bg-stone-200 fill-neutral-900 p-3 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					title="Randomize shape"
					type="submit"
				>
					<span class="sr-only">Randomize shape</span>
					<ShuffleIcon />
				</button>
			</form>
		</div>
		<div
			class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
		>
			<button
				class="h-14 w-14 bg-cyan-500 fill-neutral-900 p-3 focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
				title="Copy shape"
				use:copy={{ value: data.identifier }}
			>
				<span class="sr-only">Copy shape</span>
				<CopyIcon />
			</button>
			<button
				class="h-14 w-14 bg-cyan-500 fill-neutral-900 p-3 focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
				type="button"
				title={`Turn fullscreen ${isFullscreen ? 'off' : 'on'}`}
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
					class="inline-flex h-14 w-14 items-center justify-center bg-cyan-500 fill-neutral-900 p-3 transition focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
					title="Reset controls"
					type="submit"
				>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</form>
		</div>
		<div
			class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
		>
			<button
				class="h-14 w-14 bg-neutral-950 fill-stone-100 p-3 focus-within:bg-neutral-900 hover:bg-neutral-900 active:bg-black"
				title={`${isBookmark ? 'Add to' : 'Remove from'} library`}
				on:click={() => onBookmark()}
			>
				<span class="sr-only">{isBookmark ? 'Add to' : 'Remove from'} library</span>
				{#if !isBookmark}
					<BookmarkIcon />
				{:else}
					<BookmarkFilledIcon />
				{/if}
			</button>
		</div>
	</div>
	<div class="aspect-h-3 aspect-w-4">
		<canvas
			class="bg-neutral-900 outline-none data-[loading=true]:pointer-events-none"
			tabindex="-1"
			data-loading={isLoading}
			use:view={{ data: data.data, isExtended, isExpanded }}
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
