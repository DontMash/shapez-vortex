<script lang="ts">
	import type { ResearchEntry } from '$lib/research.types';

	import ResearchGoal from '$lib/components/research/ResearchGoal.svelte';
	import PersonalPlaceIcon from '$lib/components/icons/PersonalPlaceIcon.svelte';

	export let data: Array<ResearchEntry>;
</script>

<ol class="flex items-start space-x-16">
	{#each data.slice(1) as entry, index}
		<li>
			<article
				class="relative w-[30rem] shrink-0 space-y-4 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
			>
				<header
					class="mb-4 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 pb-4"
				>
					<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
						<span class="inline-block h-6 w-6 fill-stone-100">
							<PersonalPlaceIcon />
						</span>
						<span>
							Milestone {index + 1}
						</span>
					</h2>
				</header>
				
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
			</article>
		</li>
	{/each}
</ol>
