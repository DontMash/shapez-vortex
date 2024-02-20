<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { GAME_VERSION } from '$lib/blueprint.types';

	import CopyButton from '$lib/components/CopyButton.svelte';
	import DataObjectIcon from '$lib/components/icons/DataObjectIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4">
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6">
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

	<form class="join join-vertical w-full" method="post" action="?/update">
		<label class="form-control join-item" for="blueprint-version">
			<div class="label">
				<span class="label-text"> Blueprint version </span>
				{#if $page.form && $page.form.invalid && $page.form.identifier}
					<span class="label-text-alt font-medium italic text-error">
						Blueprint identifier is invalid
					</span>
				{/if}
			</div>
			<input
				class="input input-lg input-bordered rounded-b-none"
				name="blueprint-version"
				id="blueprint-version"
				type="text"
				inputmode="numeric"
				value={GAME_VERSION}
				pattern="^\d\d\d\d$"
				required
			/>
		</label>

		<label class="form-control join-item h-80" for="blueprint-identifier-update">
			<textarea
				class="textarea textarea-bordered textarea-lg resize-none rounded-none h-full w-full"
				name="blueprint-identifier"
				id="blueprint-identifier-update"
				placeholder="Blueprint identifier..."
				value={$page.form && $page.form.invalid && $page.form.identifier
					? $page.form.identifier
					: ''}
				required
			/>
			<span class="sr-only">Blueprint identifier</span>
		</label>
		<button class="btn btn-primary join-item" title="Update blueprint" type="submit">Update</button>
	</form>

	{#if $page.form && $page.form.success && $page.form.identifier}
		<div
			class="mt-16 relative group"
		>
			<p class="h-80 textarea textarea-lg textarea-bordered break-words overflow-y-auto">
				{$page.form.identifier}
			</p>
			<div
				class="absolute right-8 top-4 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
			>
				<CopyButton value={$page.form.identifier} />
			</div>
		</div>
	{/if}
</section>
