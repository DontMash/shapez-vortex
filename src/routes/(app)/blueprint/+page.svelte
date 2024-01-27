<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

	import DomainIcon from '$lib/components/icons/DomainIcon.svelte';

	export let data: PageData;

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
		input.form?.reset();
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<DomainIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<div
		class="space-y-2 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
	>
		<form class="space-y-2" method="post" action="?/view">
			<label
				class="flex h-80 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 pl-6 pt-4 transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				for="blueprint-identifier"
			>
				<textarea
					class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
					name="identifier"
					id="blueprint-identifier"
					placeholder="Blueprint identifier..."
					required
				/>
				<span class="sr-only">Blueprint identifier</span>
			</label>

			{#if $page.form && $page.form.invalid && $page.form.identifier}
				<output class="mt-2 inline-block font-medium italic text-red-700"
					>Blueprint data is invalid</output
				>
			{/if}

			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-2xl border-2 border-neutral-800"
			>
				<label
					class="inline-flex space-x-2 bg-neutral-800 bg-opacity-30 px-6 py-3 focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
					for="blueprint-update"
				>
					<input class="outline-none" type="checkbox" name="update" id="blueprint-update" />
					<span>Update</span>
					<span class="sr-only">blueprint to current game version</span>
				</label>
				<button
					class="w-full bg-neutral-800 bg-opacity-30 px-6 py-3 outline-none focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
					title="View blueprint"
					type="submit"
				>
					View
				</button>
			</div>
		</form>

		<form method="post" action="/blueprint/view/?/upload" enctype="multipart/form-data">
			<label class="button primary w-full focus-within:bg-opacity-80" for="blueprint-file">
				<input
					class="sr-only"
					id="blueprint-file"
					name="file"
					type="file"
					accept={BLUEPRINT_FILE_FORMAT}
					required
					on:change={(event) => onFileChange(event)}
				/>
				<span>Load</span>
			</label>
		</form>
	</div>
</section>
