<script lang="ts">
	import type { ResearchEntry } from '$lib/research.types';

	import ResearchGoal from '$lib/components/research/ResearchGoal.svelte';

	export let data: Array<ResearchEntry>;
</script>

<ol class="flex items-start space-x-16">
	{#each data.slice(1) as entry}
		<li
			class="relative w-[30rem] shrink-0 space-y-4 rounded-[2rem] border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
		>
			<div class="p-6">
				<ResearchGoal data={entry.Node} />
			</div>
			{#if entry.SideGoals.length > 0}
				<ul class="space-y-4">
					{#each entry.SideGoals as node}
						<li class="rounded-3xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 p-6">
							<ResearchGoal data={node} />
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ol>
