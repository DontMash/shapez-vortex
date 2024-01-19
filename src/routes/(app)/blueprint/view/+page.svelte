<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';
	import { view } from '$lib/client/blueprints';
	import { create } from '$lib/client/user/database';
	import { capture } from '$lib/client/actions/capture';
	import { copy, paste } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';

	import Dialog from '$lib/components/Dialog.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import UploadIcon from '$lib/components/icons/UploadIcon.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import PasteIcon from '$lib/components/icons/PasteIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import PhotoCameraIcon from '$lib/components/icons/PhotoCameraIcon.svelte';
	import FullscreenIcon from '$lib/components/icons/FullscreenIcon.svelte';
	import FullscreenExitIcon from '$lib/components/icons/FullscreenExitIcon.svelte';
	import RestartAltIcon from '$lib/components/icons/RestartAltIcon.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkIcon.svelte';
	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';

	export let data: PageData;

	let viewer: HTMLElement;
	let canvas: HTMLCanvasElement;
	let isLoading = true;
	let isFullscreen = false;
	let isCenter = false;
	let isBookmark = false;
	let isOpen: boolean;

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
	async function onBookmark() {
		const { blueprint } = await create();
		const { remove } = blueprint;

		if (isBookmark) {
			await remove(data.blueprint.identifier);
		} else {
			isOpen = true;
		}
		await updateBookmark();
	}
	async function addBookmark(name: string) {
		const { blueprint } = await create();
		const { add } = blueprint;

		await add({ ...data.blueprint, meta: { ...data.blueprint.meta, name } });
		isOpen = false;
		await updateBookmark();
	}
	async function updateBookmark() {
		const { blueprint } = await create();
		const { has } = blueprint;

		isBookmark = await has(data.blueprint.identifier);
	}

	onMount(async () => {
		await updateBookmark();
	});
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<figure class="relative" bind:this={viewer}>
		<div class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center space-x-4 p-4">
			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
			>
				<form
					class="group"
					method="post"
					action="/blueprint/view/?/upload"
					enctype="multipart/form-data"
				>
					<label
						class="inline-flex h-14 w-14 items-center justify-center bg-stone-200 fill-neutral-900 p-3 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
						for="blueprint-file"
					>
						<input
							class="hidden"
							id="blueprint-file"
							name="file"
							type="file"
							accept={BLUEPRINT_FILE_FORMAT}
							required
							on:change={(event) => onFileChange(event)}
						/>
						<span class="sr-only">Load blueprint</span>
						<UploadIcon />
					</label>
				</form>
				<form class="group" action="/blueprint/download">
					<input name="identifier" type="hidden" value={data.blueprint.identifier} required />
					{#if data.blueprint.meta.name}
						<input name="name" type="hidden" value={data.blueprint.meta.name} required />
					{/if}
					<button
						class="inline-flex h-14 w-14 items-center justify-center bg-stone-200 fill-neutral-900 p-3 text-neutral-800 outline-none transition focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
						title="Download blueprint"
						type="submit"
					>
						<span class="sr-only">Download blueprint</span>
						<DownloadIcon />
					</button>
				</form>
				<form class="group">
					<input name="identifier" type="hidden" required />
					<button
						class="h-14 w-14 bg-stone-200 fill-neutral-900 p-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
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
					class="h-14 w-14 bg-stone-200 fill-neutral-900 p-3 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
					title="Copy blueprint"
					use:copy={{ value: $page.url.searchParams.get('identifier') }}
				>
					<span class="sr-only">Copy blueprint</span>
					<CopyIcon />
				</button>
			</div>
			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
			>
				<button
					class="h-14 w-14 bg-cyan-500 fill-neutral-900 p-3 focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
					title="Capture blueprint"
					use:capture={{ captureElement: canvas, filename: data.blueprint.meta.name }}
				>
					<span class="sr-only">Capture blueprint</span>
					<PhotoCameraIcon />
				</button>
				<button
					class="h-14 w-14 bg-cyan-500 fill-neutral-900 p-3 focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
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
					class="h-14 w-14 bg-cyan-500 fill-neutral-900 p-3 focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
					title="Reset controls"
					on:click={() => reset()}
				>
					<span class="sr-only">Reset controls</span>
					<RestartAltIcon />
				</button>
			</div>

			{#if !isLoading}
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
			{/if}
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
				use:view={{ blueprint: data.blueprint.data, isCenter }}
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

	<Dialog
		open={isOpen}
		on:confirm={(event) => {
			const data = event.detail;
			if (!data) return;
			const name = data.get('name');
			if (!name || typeof name !== 'string') return;
			addBookmark(name);
		}}
		on:cancel={() => (isOpen = false)}
	>
		<h2 class="mb-6 text-4xl font-bold">Add</h2>
		<p>What name should the blueprint have?</p>
		<label class="mt-2 block" for="blueprint-name">
			<span class="sr-only">Blueprint name</span>
			<input
				class="w-full rounded-lg bg-stone-200 p-3 text-neutral-800 outline-none transition placeholder:select-none placeholder:text-stone-400 placeholder:transition hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:placeholder:text-stone-600"
				id="blueprint-name"
				name="name"
				type="text"
				placeholder="Name..."
				value={data.blueprint.meta.name ?? ''}
			/>
		</label>
	</Dialog>
</section>
