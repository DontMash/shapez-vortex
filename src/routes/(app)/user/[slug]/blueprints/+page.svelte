<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import BlueprintItem from '$lib/components/blueprint/BlueprintItem.svelte';
	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';

	export let data: PageData;

	function getBlueprintUrl(id: string): string {
		const url = new URL(`/blueprint/${id}`, $page.url.origin);
		return url.href;
	}
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-4 pb-4"
	>
		<h2 class="inline-flex flex-grow items-center space-x-2 text-lg font-bold">
			<span class="inline-block h-6 w-6">
				<BookmarkFilledIcon />
			</span>
			<span>
				{data.seo.title}
			</span>
		</h2>
	</header>

	{#if data.blueprints && data.blueprints.length > 0}
		<ul class="space-y-8">
			{#each data.blueprints as blueprint}
				{@const preview = data.images && data.images[blueprint.id]}
				<li>
					<BlueprintItem
						data={blueprint}
						image={preview}
						url={getBlueprintUrl(blueprint.id)}
						isEditable={data.user && data.user.id === blueprint.creator}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="flex items-center justify-center">
			<span>No blueprints</span>
		</div>
	{/if}
</section>
