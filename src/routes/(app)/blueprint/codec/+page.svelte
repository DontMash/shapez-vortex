<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-4 pb-4"
	>
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--braces] align-text-bottom text-2xl" />
				{data.seo.title}
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

	<div class="join join-vertical w-full">
		<form class="join-item" method="post" action="?/decode">
			<label class="form-control h-80" for="blueprint-identifier-decode">
				<div class="label">
					{#if $page.form && $page.form.invalid && $page.form.blueprintIdentifier}
						<span class="label-text-text font-medium italic text-error">
							Blueprint identifier is invalid
						</span>
					{/if}
					<span class="label-text-alt sr-only">Blueprint identifier</span>
				</div>
				{#if $page.form && $page.form.blueprintIdentifier}
					<textarea
						class="textarea textarea-bordered textarea-lg h-full w-full resize-none rounded-b-none"
						name="blueprint-identifier"
						id="blueprint-identifier-decode"
						placeholder="Blueprint identifier..."
						value={$page.form.blueprintIdentifier}
						required
					/>
				{:else}
					<textarea
						class="textarea textarea-bordered textarea-lg h-full w-full resize-none rounded-b-none"
						name="blueprint-identifier"
						id="blueprint-identifier-decode"
						placeholder="Blueprint identifier..."
						required
					/>
				{/if}
			</label>
			<button
				class="btn btn-primary btn-block rounded-none"
				title="Decode blueprint identifier"
				type="submit"
			>
				<span class="icon-[tabler--code-dots] text-2xl" />
				Decode
			</button>
		</form>

		<form class="join-item" method="post" action="?/encode">
			<button
				class="btn btn-accent btn-block rounded-none text-primary"
				title="Encode blueprint data"
				type="submit"
			>
				<span class="icon-[tabler--code-minus] text-2xl" />
				Encode
			</button>
			<label class="form-control h-80" for="blueprint-data-encode">
				{#if $page.form && ($page.form.blueprint || $page.form.blueprintData)}
					<textarea
						class="textarea textarea-bordered textarea-lg h-full w-full resize-none rounded-t-none"
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
						class="textarea textarea-bordered textarea-lg h-full w-full resize-none rounded-t-none"
						name="blueprint-data"
						id="blueprint-data-encode"
						placeholder="Blueprint data..."
						required
					/>
				{/if}
				<div class="label">
					{#if $page.form && $page.form.invalid && $page.form.blueprintData}
						<span class="label-text-text font-medium italic text-error">
							Blueprint data is invalid
						</span>
					{/if}
					<span class="label-text-alt sr-only">Blueprint data</span>
				</div>
			</label>
		</form>
	</div>
</section>
