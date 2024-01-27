<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { GAME_VERSION } from '$lib/blueprint.types';

	import CopyButton from '$lib/components/CopyButton.svelte';
	import DataObjectIcon from '$lib/components/icons/DataObjectIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<DataObjectIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
			<p>This tool modifies any blueprint to work in the current version of the game.</p>
			<i class="text-xs">
				No guarantee for older blueprints to work in newer versions of the game!
			</i>
		</hgroup>
	</header>

	<form
		class="space-y-2 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
		method="post"
		action="?/update"
	>
		<label
			class="flex divide-x-2 divide-neutral-800 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="blueprint-version"
		>
			<span class="shrink-0 px-6 py-3"> Blueprint version </span>
			<input
				class="w-full bg-transparent px-6 outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
				name="blueprint-version"
				id="blueprint-version"
				type="text"
				inputmode="numeric"
				value={GAME_VERSION}
				pattern="^\d\d\d\d$"
				required
			/>
		</label>
		<label
			class="group relative flex h-60 flex-col rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 pl-6 pt-4 transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="blueprint-identifier-update"
		>
			<span class="sr-only">Blueprint identifier</span>
			<textarea
				class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
				name="blueprint-identifier"
				id="blueprint-identifier-update"
				placeholder="Blueprint identifier..."
				value={$page.form && $page.form.invalid && $page.form.identifier
					? $page.form.identifier
					: ''}
				required
			/>
		</label>
		{#if $page.form && $page.form.invalid && $page.form.identifier}
			<output class="mt-2 inline-block font-medium italic text-red-700"
				>Blueprint identifier is invalid</output
			>
		{/if}
		<button class="button primary w-full" title="Update blueprint" type="submit">Update</button>
	</form>

	{#if $page.form && $page.form.success && $page.form.identifier}
		<div
			class="group relative mt-4 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 px-6 pt-6 shadow-lg"
		>
			<p class="h-80 overflow-y-auto break-words">
				{$page.form.identifier}
			</p>
			<div
				class="absolute right-12 top-6 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
			>
				<CopyButton value={$page.form.identifier} color="light" />
			</div>
		</div>
	{/if}
</section>
