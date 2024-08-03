<script lang="ts">
	import { page } from '$app/stores';
	import type { ShapeData } from '$lib/shape.types';
	import { view } from '$lib/client/shapes';
	import { copy } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';
	import { add } from '$lib/client/toast/toast.service';

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
					.then(() => add({ message: 'Copied shape image' }))
					.catch(() => add({ message: 'Error while creating shape image', type: 'ERROR' }));
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
				<button
					class="h-full w-full"
					title="{isExtended ? 'Contract' : 'Extend'} layers"
					type="submit"
				>
					{#if isExtended}
						<span class="icon-[tabler--stack-forward] align-text-bottom text-2xl" />
					{:else}
						<span class="icon-[tabler--stack] align-text-bottom text-2xl" />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={isExtended} />
				<input name="expand" type="hidden" value={!isExpanded} />
				<button
					class="h-full w-full"
					title="{isExpanded ? 'Collapse' : 'Expand'} quarters"
					type="submit"
				>
					{#if isExpanded}
						<span class="icon-[tabler--border-none] align-text-bottom text-2xl" />
					{:else}
						<span class="icon-[tabler--border-all] align-text-bottom text-2xl" />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" method="post" action="/shape/?/random">
				<button class="h-full w-full" title="Randomize shape" type="submit">
					<span class="icon-[tabler--arrows-shuffle] align-text-bottom text-2xl">Shuffle</span>
				</button>
			</form>
		</div>

		<div class="join">
			<button
				class="btn btn-square btn-secondary join-item"
				title="Copy shape"
				use:copy={{ value: data.identifier }}
				on:copy={() => add({ message: 'Content copied' })}
				on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
			>
				<span class="icon-[tabler--copy] text-2xl" />
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				title="Capture shape"
				on:click={onCapture}
			>
				<span class="icon-[tabler--camera] text-2xl" />
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				type="button"
				title={`Turn fullscreen ${isFullscreen ? 'off' : 'on'}`}
				use:fullscreen={{ fullscreenElement: viewer }}
				on:change={(event) => (isFullscreen = event.detail)}
				on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
			>
				{#if isFullscreen}
					<span class="icon-[material-symbols--fullscreen-exit-rounded] text-2xl" />
				{:else}
					<span class="icon-[material-symbols--fullscreen-rounded] text-2xl" />
				{/if}
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				type="button"
				title="View top down"
				on:click={onTop}
			>
				<span class="icon-[tabler--circle] text-2xl" />
			</button>
			<form class="btn btn-square btn-secondary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<button class="h-full w-full" title="Reset controls" type="submit" on:click={onReset}>
					<span class="icon-[tabler--reload] align-text-bottom text-2xl" />
				</button>
			</form>
		</div>

		<form class="join">
			<label
				class="input join-item input-bordered flex items-center space-x-2"
				for="shape-identifier"
				aria-label="Shape identifier"
			>
				<input
					class="peer grow"
					type="text"
					id="shape-identifier"
					name="identifier"
					placeholder="Shape code..."
					value={$page.data.shape?.identifier ?? ''}
					required
					minlength="2"
					maxlength="35"
				/>

				<button
					class="btn btn-square btn-ghost btn-sm peer-placeholder-shown:hidden"
					type="reset"
					title="Clear shape input"
				>
					<span class="icon-[tabler--x] text-lg" />
				</button>
			</label>
			<button class="btn btn-square btn-accent join-item">
				<span class="icon-[tabler--arrow-narrow-right] text-2xl" />
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
