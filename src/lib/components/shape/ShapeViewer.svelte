<script lang="ts">
	import { page } from '$app/stores';
	import type { ShapeData } from '$lib/shape.types';
	import { view } from '$lib/client/actions/shape/shape-view';
	import { copy } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';

	import ArrowRightAltIcon from '$lib/components/icons/ArrowRightAltIcon.svelte';
	import CircleIcon from '$lib/components/icons/CircleIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';
	import PhotoCameraIcon from '$lib/components/icons/PhotoCameraIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';
	import ShuffleIcon from '$lib/components/icons/ShuffleIcon.svelte';
	import { TOAST_TYPE, add } from '$lib/client/toast/toast.service';

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;

	let viewer: HTMLElement;
	let canvas: HTMLCanvasElement;
	let isLoading = true;
	let isFullscreen = false;
	let isReset = false;
	let isTop = false;

	$: {
		if (isTop || isReset) {
			setTimeout(() => {
				isReset = false;
				isTop = false;
			}, 100);
		}
	}

	function onCapture() {
		canvas.toBlob(
			(blob) => {
				if (!blob) return;

				const items = { [blob.type]: blob };
				const clipboardItem = new ClipboardItem(items);
				navigator.clipboard
					.write([clipboardItem])
					.then(() => add('Copied shape image'))
					.catch(() => add('Error while creating shape image', 3000, TOAST_TYPE.ERROR));
			},
			'image/png',
			1
		);
	}
	function onReset() {
		isReset = true;
	}
	function onTop() {
		isTop = true;
	}
</script>

<figure class="relative" bind:this={viewer}>
	<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center space-x-4 p-4">
		<div class="join">
			<form class="btn btn-square btn-primary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={!isExtended} />
				<input name="expand" type="hidden" value={isExpanded} />
				<button class="h-full w-full p-2.5" title="Extend layers" type="submit">
					<span class="sr-only">Extend layers</span>
					{#if isExtended}
						<LayersIcon />
					{:else}
						<LayersFilledIcon />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={isExtended} />
				<input name="expand" type="hidden" value={!isExpanded} />
				<button class="h-full w-full p-2.5" title="Expand quarters" type="submit">
					<span class="sr-only">Expand quarters</span>
					{#if isExpanded}
						<LayersClearIcon />
					{:else}
						<LayersClearFilledIcon />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" method="post" action="/shape/?/random">
				<button class="h-full w-full p-2.5" title="Randomize shape" type="submit">
					<span class="sr-only">Randomize shape</span>
					<ShuffleIcon />
				</button>
			</form>
		</div>

		<div class="join">
			<button
				class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
				title="Copy shape"
				use:copy={{ value: data.identifier }}
			>
				<span class="sr-only">Copy shape</span>
				<CopyIcon />
			</button>
			<button
				class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
				title="Capture shape"
				on:click={onCapture}
			>
				<span class="sr-only">Capture shape</span>
				<PhotoCameraIcon />
			</button>
			<button
				class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
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
			<button
				class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
				type="button"
				title="View top down"
				on:click={onTop}
			>
				<span class="sr-only">View top down</span>
				<CircleIcon />
			</button>
			<form class="btn btn-square btn-secondary join-item fill-secondary-content" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<button class="h-full w-full p-2.5" title="Reset controls" type="submit" on:click={onReset}>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</form>
		</div>

		<form class="join">
			<label
				class="form-control join-item relative flex"
				for="shape-identifier"
				aria-label="Shape identifier"
			>
				<input
					class="peer input join-item input-bordered pr-12"
					type="text"
					id="shape-identifier"
					name="identifier"
					placeholder="Shape code..."
					value={$page.data.shape?.identifier ?? ''}
					required
					minlength="2"
					maxlength="35"
				/>
				<div class="absolute right-2 top-1/2 -translate-y-1/2 peer-placeholder-shown:hidden">
					<button
						class="btn btn-square btn-ghost btn-sm p-1"
						type="reset"
						title="Clear shape input"
					>
						<CloseIcon />
					</button>
				</div>
			</label>
			<button class="btn btn-square btn-accent join-item fill-accent-content p-2.5">
				<ArrowRightAltIcon />
			</button>
		</form>
	</div>

	<div class="aspect-h-3 aspect-w-4">
		<canvas
			class="bg-neutral-900 outline-none data-[loading=true]:pointer-events-none"
			tabindex="-1"
			data-loading={isLoading}
			use:view={{ data: data.data, isExtended, isExpanded, isReset, isTop }}
			on:load={() => (isLoading = false)}
			bind:this={canvas}
		/>
	</div>

	{#if isLoading}
		<div
			class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
		>
			<span class="loading loading-spinner loading-lg" />
		</div>
	{/if}

	<figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
