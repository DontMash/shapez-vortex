<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import DataObjectIcon from '$lib/components/icons/DataObjectIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-4 pb-4"
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
			<p>
				This tool decodes any blueprint to a human-readable
				<a
					class="underline"
					href="https://developer.mozilla.org/en-US/docs/Glossary/JSON"
					target="_blank">JSON-Object</a
				>.
			</p>
			<p>
				It is also able to encode said object to a blueprint identifier which can be used in the
				game.
			</p>
		</hgroup>
	</header>

	<div class="space-y-12">
		<form
			class="space-y-2 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
			method="post"
			action="?/decode"
		>
			<label
				class="group relative flex h-60 flex-col rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 pl-6 pt-4 transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				for="blueprint-identifier-decode"
			>
				<span class="sr-only">Blueprint identifier</span>
				{#if $page.form && $page.form.blueprintIdentifier}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-identifier"
						id="blueprint-identifier-decode"
						placeholder="Blueprint identifier..."
						value={$page.form.blueprintIdentifier}
						required
					/>
				{:else}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-identifier"
						id="blueprint-identifier-decode"
						placeholder="Blueprint identifier..."
						required
					/>
				{/if}
			</label>
			{#if $page.form && $page.form.invalid && $page.form.blueprintIdentifier}
				<output class="mt-2 inline-block font-medium italic text-red-700"
					>Blueprint identifier is invalid</output
				>
			{/if}
			<button class="button primary w-full" title="Decode blueprint identifier" type="submit">
				Decode
			</button>
		</form>

		<form
			class="space-y-2 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
			method="post"
			action="?/encode"
		>
			<button class="button primary w-full" title="Encode blueprint data" type="submit">
				Encode
			</button>
			{#if $page.form && $page.form.invalid && $page.form.blueprintData}
				<output class="mt-2 inline-block font-medium italic text-red-700"
					>Blueprint data is invalid</output
				>
			{/if}
			<label
				class="group relative flex h-60 flex-col rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 pl-6 pt-4 transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				for="blueprint-data-encode"
			>
				<span class="sr-only">Blueprint data</span>
				{#if $page.form && ($page.form.blueprint || $page.form.blueprintData)}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-data"
						id="blueprint-data-encode"
						placeholder="Blueprint data..."
						value={$page.form.invalid
							? $page.form.blueprintData
							: JSON.stringify($page.form.blueprint, null, 4)}
						required
					/>
				{:else}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-data"
						id="blueprint-data-encode"
						placeholder="Blueprint data..."
						required
					/>
				{/if}
			</label>
		</form>
	</div>
</section>
