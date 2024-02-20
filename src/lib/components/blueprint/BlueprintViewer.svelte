<script lang="ts">
	import {
		BLUEPRINT_FILE_FORMAT,
		type Blueprint,
		type BlueprintIdentifier
	} from '$lib/blueprint.types';
	import { view } from '$lib/client/blueprints';
	import { capture } from '$lib/client/actions/capture';
	import { copy, paste } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';

	import FileUploadIcon from '$lib/components/icons/FileUploadIcon.svelte';
	import FileDownloadIcon from '$lib/components/icons/FileDownloadIcon.svelte';
	import PasteIcon from '$lib/components/icons/PasteIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import PhotoCameraIcon from '$lib/components/icons/PhotoCameraIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';
	import { onMount } from 'svelte';

	export let identifier: BlueprintIdentifier;
	export let blueprint: Blueprint;
	export let title: string = 'Untitled blueprint';
	export let controls: boolean = false;
	export let enableZoom: boolean = true;

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

	onMount(() => {
		if (!identifier) throw new Error('No identifier provided');
	});
</script>

<figure class="relative" bind:this={viewer}>
	{#if controls}
		<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center space-x-4 p-4">
			<div class="join">
				<form
					class="btn btn-square btn-primary join-item"
					method="post"
					action="/blueprint/view/?/upload"
					enctype="multipart/form-data"
				>
					<label class="h-full w-full p-2.5" for="blueprint-file">
						<input
							class="sr-only"
							id="blueprint-file"
							name="file"
							type="file"
							accept={BLUEPRINT_FILE_FORMAT}
							required
							on:change={(event) => onFileChange(event)}
						/>
						<span class="sr-only">Load blueprint</span>
						<FileUploadIcon />
					</label>
				</form>
				<form class="btn btn-square btn-primary join-item" action="/blueprint/download">
					<input name="identifier" type="hidden" value={identifier} required />
					<button class="h-full w-full p-2.5" title="Download blueprint" type="submit">
						<span class="sr-only">Download blueprint</span>
						<FileDownloadIcon />
					</button>
				</form>
				<form class="btn btn-square btn-primary join-item">
					<input name="identifier" type="hidden" required />
					<button
						class="h-full w-full p-2.5"
						title="Paste blueprint"
						type="button"
						use:paste
						on:paste={(event) => onPaste(event)}
					>
						<span class="sr-only">Paste blueprint</span>
						<PasteIcon />
					</button>
				</form>
				<button
					class="btn btn-square btn-primary join-item p-2.5"
					title="Copy blueprint"
					use:copy={{ value: identifier }}
				>
					<span class="sr-only">Copy blueprint</span>
					<CopyIcon />
				</button>
			</div>

			<div class="join">
				<button
					class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
					title="Capture blueprint"
					use:capture={{ captureElement: canvas, filename: title }}
				>
					<span class="sr-only">Capture blueprint</span>
					<PhotoCameraIcon />
				</button>
				<button
					class="btn btn-square btn-secondary join-item fill-secondary-content p-2.5"
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
					title="Reset controls"
					on:click={() => reset()}
				>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</div>
		</div>
	{/if}

	<div class="aspect-h-3 aspect-w-4">
		<canvas
			class={`border border-base-content border-opacity-20 bg-base-100 shadow-lg outline-none data-[loading=true]:pointer-events-none ${
				!isFullscreen ? 'rounded-4xl border' : ''
			}`}
			tabindex="-1"
			data-loading={isLoading}
			bind:this={canvas}
			on:load={() => {
				isLoading = false;
			}}
			use:view={{ blueprint, enableZoom, isCenter }}
		/>
	</div>

	{#if isLoading}
		<div
			class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
		>
			<span class="loading loading-spinner loading-lg" />
		</div>
	{/if}

	<figcaption class="sr-only">Blueprint Viewer</figcaption>
</figure>
