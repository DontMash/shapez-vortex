<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { GAME_VERSION } from '$lib/blueprint.types';

	import CopyButton from '$lib/components/CopyButton.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--braces] align-text-bottom text-2xl" />
				{data.seo.title}
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
			<div class="input input-lg input-bordered rounded-b-none flex items-center space-x-2">
				<span class="icon-[tabler--square-rounded-letter-v] text-2xl" />
				<input
					class=""
					name="blueprint-version"
					id="blueprint-version"
					type="text"
					inputmode="numeric"
					value={GAME_VERSION}
					pattern="^\d\d\d\d$"
					required
				/>
			</div>
		</label>

		<label class="form-control join-item h-80" for="blueprint-identifier-update">
			<textarea
				class="textarea textarea-bordered textarea-lg h-full w-full resize-none rounded-none"
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
		<p class="textarea textarea-bordered textarea-lg mt-16 h-80 overflow-y-auto break-words">
			<span class="float-right">
				<CopyButton value={$page.form.identifier} />
			</span>
			{$page.form.identifier}
		</p>
	{/if}
</section>
