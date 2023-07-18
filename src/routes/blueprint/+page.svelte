<script lang="ts">
	import { page } from '$app/stores';
	import CopyButton from '$lib/components/CopyButton.svelte';

	const GAME_VERSION = 1019;

	const hasData = !!$page.form;
	const isModify = $page.url.searchParams.get('/modify') !== null && hasData;
	const isDecode = $page.url.searchParams.get('/decode') !== null && hasData;
	const isEncode = $page.url.searchParams.get('/encode') !== null && hasData;
</script>

<svelte:head>
	<title>Blueprint Transformer</title>
</svelte:head>

<h1 class="sr-only">Blueprint Transformer</h1>

<section class="mx-auto flex w-full max-w-5xl flex-col items-center space-y-4">
	<div class="self-start">
		<h2 class="text-3xl">Converter</h2>
		<p class="mt-4">This tool modifies any blueprint to work in the current version of the game.</p>
		<i class="text-xs">No guarantee for older blueprints to work in newer versions of the game!</i>
	</div>

	<form
		class="flex w-[32rem] flex-col divide-y-2 divide-neutral-900 border-2 border-neutral-900"
		method="post"
		action="/blueprint?/modify"
	>
		<label
			class="flex h-12 items-center bg-stone-200 p-2 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
			for="blueprint-version"
		>
			<input
				class="peer order-1 w-full bg-transparent pl-2 outline-none placeholder:select-none placeholder:text-stone-400 placeholder-shown:pl-0"
				name="blueprint-version"
				id="blueprint-version"
				type="text"
				inputmode="numeric"
				value={GAME_VERSION}
				placeholder="Blueprint version..."
				pattern="^\d\d\d\d$"
				required
			/>
			<span
				class="max-h-full w-44 leading-none opacity-100 transition-all peer-placeholder-shown:w-0 peer-placeholder-shown:opacity-0"
			>
				Blueprint version
			</span>
		</label>
		<label
			class="flex h-40 flex-col bg-stone-200 p-2 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
			for="blueprint-identifier-modify"
		>
			<span class="sr-only">Blueprint identifier</span>
			<textarea
				class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
				name="blueprint-identifier"
				id="blueprint-identifier-modify"
				placeholder="Blueprint identifier..."
				required
			/>
		</label>
		<button
			class="inline-block h-12 bg-cyan-500 leading-none text-neutral-800 outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
			type="submit">Modify</button
		>
	</form>

	{#if isModify}
		<output class="group relative h-40 w-[32rem] overflow-y-auto break-words bg-neutral-900 p-2">
			<span>{$page.form}</span>
			<div
				class="absolute right-2 top-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
			>
				<CopyButton value={$page.form} />
			</div>
		</output>
	{/if}
</section>

<section class="mx-auto flex w-full max-w-5xl flex-col items-center space-y-4 pt-4">
	<div class="self-start">
		<h2 class="text-3xl">Decode - Encode</h2>
		<p class="mt-4">
			This tool decodes any blueprint to a human-readable
			<a
				class="underline"
				href="https://developer.mozilla.org/en-US/docs/Glossary/JSON"
				target="_blank">JSON-Object</a
			>.
		</p>
		<p>
			It is also able to encode said object to a blueprint identifier which can be used in the game.
		</p>
	</div>

	<div class="divide-y-2 divide-neutral-900 border-2 border-neutral-900">
		<form
			class="flex w-[32rem] flex-col divide-y-2 divide-neutral-900"
			method="post"
			action="/blueprint?/decode"
		>
			<label
				class="group relative flex h-40 flex-col bg-stone-200 p-2 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
				for="blueprint-identifier-decode"
			>
				<span class="sr-only">Blueprint identifier</span>
				{#if isEncode}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-identifier"
						id="blueprint-identifier-decode"
						value={$page.form}
						placeholder="Blueprint identifier..."
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
				{#if hasData}
					<div
						class="absolute right-2 top-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
					>
						<CopyButton value={$page.form} color="dark" />
					</div>
				{/if}
			</label>
			<button
				class="inline-block h-12 bg-cyan-500 leading-none text-neutral-800 outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
				type="submit">Decode</button
			>
		</form>

		<form
			class="flex w-[32rem] flex-col divide-y-2 divide-neutral-900"
			method="post"
			action="/blueprint?/encode"
		>
			<button
				class="inline-block h-12 bg-neutral-900 leading-none outline-none transition hover:bg-neutral-800 focus-visible:bg-neutral-800 active:bg-black"
				type="submit">Encode</button
			>
			<label
				class="group relative flex h-40 flex-col bg-stone-200 p-2 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
				for="blueprint-data-encode"
			>
				<span class="sr-only">Blueprint data</span>
				{#if isDecode}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-data"
						id="blueprint-data-encode"
						value={JSON.stringify($page.form)}
						placeholder="Blueprint data..."
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
				{#if hasData}
					<div
						class="absolute right-2 top-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
					>
						<CopyButton value={$page.form} color="dark" />
					</div>
				{/if}
			</label>
		</form>
	</div>
</section>
