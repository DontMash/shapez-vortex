<script lang="ts">
	import type { PageData } from './$types';
	import { view } from '$lib/client/blueprints';
	import { fullscreen } from '$lib/client/fullscreen';

	import Loading from '$lib/components/Loading.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';

	export let data: PageData;

	let viewer: HTMLElement;
	let isLoading = true;
	let isFullscreen = false;
	let isCenter = false;

	function reset() {
		isCenter = true;
		setTimeout(() => (isCenter = false), 100);
	}
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<figure class="relative" bind:this={viewer}>
		<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center p-4">
			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-4xl border-2 border-neutral-800"
			>
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
				<button
					class="h-14 w-14 cursor-pointer bg-stone-200 fill-neutral-900 p-2 first:pl-3 first:pr-1 last:pl-1 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					type="button"
					on:click={() => reset()}
				>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</div>
		</div>
		<div class="aspect-h-3 aspect-w-4">
			<canvas
				class="bg-neutral-900 outline-none data-[loading=true]:pointer-events-none"
				tabindex="-1"
				data-loading={isLoading}
				on:load={() => {
					isLoading = false;
				}}
				use:view={{ blueprint: data.blueprint, isCenter }}
			/>
		</div>
		{#if isLoading}
			<div
				class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
			>
				<Loading />
			</div>
		{/if}
		<figcaption class="sr-only">Blueprint Viewer</figcaption>
	</figure>
</section>
