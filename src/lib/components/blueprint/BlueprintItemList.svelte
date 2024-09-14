<script lang="ts">
	import { page } from '$app/stores';
	import type { BlueprintRecord } from '$lib/blueprint.types';

	import BlueprintItem from './BlueprintItem.svelte';

	export let items: Array<BlueprintRecord>;
	export let images: Record<string, string>;

	function getBlueprintUrl(id: string): string {
		const url = new URL(`/blueprint/${id}`, $page.url.origin);
		return url.href;
	}
</script>

<ul class="space-y-4">
	{#each items as blueprint}
		{@const preview = images && images[blueprint.id]}
		<li>
			<BlueprintItem
				data={blueprint}
				image={preview}
				url={getBlueprintUrl(blueprint.id)}
				isEditable={$page.data.user && $page.data.user.id === blueprint.creator}
			/>
		</li>
	{/each}
</ul>
