<script lang="ts">
	import { page } from '$app/stores';
	import CopyButton from '$lib/components/CopyButton.svelte';

	const hasData = !!$page.form;
	const isDecode = $page.url.searchParams.get('/decode') !== null && hasData;
	const isEncode = $page.url.searchParams.get('/encode') !== null && hasData;
</script>

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

	<div class="flex w-full flex-col divide-y-2 divide-neutral-900 border-2 border-neutral-900">
		<form class="flex flex-col divide-y-2 divide-neutral-900 overflow-hidden rounded-t-4xl" method="post" action="?/decode">
			<label
				class="group relative flex h-60 flex-col bg-stone-200 px-6 py-4 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
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
				{#if hasData && isEncode}
					<div
						class="absolute right-6 top-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
					>
						<CopyButton value={$page.form} color="dark" />
					</div>
				{/if}
			</label>
			<button
				class="inline-block bg-cyan-500 h-12 leading-none text-neutral-800 outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
				type="submit"
			>
				Decode
			</button>
		</form>

		<form class="flex flex-col divide-y-2 divide-neutral-900 overflow-hidden rounded-b-4xl" method="post" action="?/encode">
			<button
				class="inline-block bg-neutral-900 h-12 leading-none outline-none transition hover:bg-neutral-800 focus-visible:bg-neutral-800 active:bg-black"
				type="submit"
			>
				Encode
			</button>
			<label
				class="group relative h-60 flex-col bg-stone-200 px-6 py-4 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
				for="blueprint-data-encode"
			>
				<span class="sr-only">Blueprint data</span>
				{#if isDecode}
					<textarea
						class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
						name="blueprint-data"
						id="blueprint-data-encode"
						value={JSON.stringify($page.form, null, 4)}
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
				{#if hasData && isDecode}
					<div
						class="absolute right-6 top-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
					>
						<CopyButton value={$page.form} color="dark" />
					</div>
				{/if}
			</label>
		</form>
	</div>
</section>
