<script lang="ts">
	import type { ResearchEntry } from '$lib/research.types';

	import ResearchGoal from './ResearchGoal.svelte';

	export let data: Array<ResearchEntry>;
</script>

<ol class="flex items-start space-x-12">
	{#each data.slice(1) as entry}
		<li class="w-96 shrink-0 relative rounded-[2rem] border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 px-6 py-4 shadow-lg">
			<ResearchGoal data={entry.Node} />
			{#if entry.SideGoals.length > 0}
				<ul class="mt-4 space-y-4">
					{#each entry.SideGoals as node}
						<li class="border-2 border-neutral-800 rounded-3xl bg-neutral-800 bg-opacity-50 px-6 py-4">
							<ResearchGoal data={node} />
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ol>
