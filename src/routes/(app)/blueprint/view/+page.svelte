<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { view } from '$lib/client/blueprints';
	import { copy, paste } from '$lib/client/clipboard';
	import { fullscreen } from '$lib/client/fullscreen';

	import Loading from '$lib/components/Loading.svelte';
	import UploadIcon from '$lib/components/icons/UploadIcon.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import PasteIcon from '$lib/components/icons/PasteIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import PhotoCameraIcon from '$lib/components/icons/PhotoCameraIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';
	import { capture } from '$lib/client/capture';

	export let data: PageData;

	let viewer: HTMLElement;
	let canvas: HTMLCanvasElement;
	let isLoading = true;
	let isFullscreen = false;
	let isCenter = false;

	function reset() {
		isCenter = true;
		setTimeout(() => (isCenter = false), 100);
	}
	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
	}
	function onPaste(event: Event) {
		const customEvent = event as CustomEvent<string>;
		const button = customEvent.target as HTMLButtonElement;
		const input = button.form?.querySelector('input[name=identifier]') as HTMLInputElement | null;
		if (!input) {
			throw new Error('No input element "identifier"');
		}
		input.value = customEvent.detail.trim();
		button.form?.submit();
		button.form?.reset();
	}
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<figure class="relative" bind:this={viewer}>
		<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center p-4">
			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-4xl border-2 border-neutral-800"
			>
				<form
					class="group"
					method="post"
					action="/blueprint/view/?/upload"
					enctype="multipart/form-data"
				>
					<label
						class="inline-flex h-14 w-14 flex-col items-center justify-center bg-stone-200 fill-neutral-900 p-2 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:w-16 group-first:pl-3 group-last:w-16 group-last:pr-3"
						for="blueprint-file"
					>
						<input
							class="hidden"
							id="blueprint-file"
							name="file"
							type="file"
							accept=".spz2bp"
							required
							on:change={(event) => onFileChange(event)}
						/>
						<span class="sr-only">Load blueprint</span>
						<UploadIcon />
					</label>
				</form>
				<form class="group" action="/blueprint/download">
					<input
						name="identifier"
						type="hidden"
						value={$page.url.searchParams.get('identifier')}
						required
					/>
					<button
						class="inline-flex h-14 w-14 flex-col items-center justify-center bg-stone-200 fill-neutral-900 p-2 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:w-16 group-first:pl-3 group-last:w-16 group-last:pr-3"
						type="submit"
					>
						<span class="sr-only">Save blueprint</span>
						<DownloadIcon />
					</button>
				</form>
				<form class="group">
					<input name="identifier" type="hidden" required />
					<button
						class="h-14 w-14 bg-stone-200 fill-neutral-900 p-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300 group-first:w-16 group-first:pl-3 group-last:w-16 group-last:pr-3"
						type="button"
						use:paste
						on:paste={(event) => onPaste(event)}
					>
						<span class="sr-only">Paste blueprint</span>
						<PasteIcon />
					</button>
				</form>
				<button
					class="h-14 w-14 bg-stone-200 fill-neutral-900 p-2 first:w-16 first:pl-3 last:w-16 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					use:copy={{ value: $page.url.searchParams.get('identifier') }}
				>
					<span class="sr-only">Copy blueprint</span>
					<CopyIcon />
				</button>
				<button
					class="h-14 w-14 bg-stone-200 fill-neutral-900 p-2 first:w-16 first:pl-3 last:w-16 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					use:capture={{ captureElement: canvas }}
				>
					<span class="sr-only">Capture blueprint</span>
					<PhotoCameraIcon />
				</button>
				<button
					class="h-14 w-14 bg-stone-200 fill-neutral-900 p-2 first:w-16 first:pl-3 last:w-16 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
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
					class="h-14 w-14 bg-stone-200 fill-neutral-900 p-2 first:w-16 first:pl-3 last:w-16 last:pr-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
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
				bind:this={canvas}
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
