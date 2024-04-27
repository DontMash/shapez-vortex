<script lang="ts">
	import type { ResearchEntry } from '$lib/research.types';

	import ResearchGoal from '$lib/components/research/ResearchGoal.svelte';
	import PersonalPlaceIcon from '$lib/components/icons/PersonalPlaceIcon.svelte';

	export let data: Array<ResearchEntry>;
</script>

<ol class="slider items-start space-x-16">
	{#each data.slice(1) as entry, index}
		<li>
			<article class="card relative w-[30rem] shrink-0 bg-base-200 shadow-lg">
				<div class="card-body">
					<header class="card-title mb-4 border-b border-base-content border-opacity-20 pb-4">
						<span class="inline-block h-6 w-6">
							<PersonalPlaceIcon />
						</span>
						<span>
							Milestone {index + 1}
						</span>
					</header>

					<ResearchGoal data={entry.Node} />
					{#if entry.SideGoals.length > 0}
						<ul class="join join-vertical mt-4">
							{#each entry.SideGoals as node}
								<li class="join-item rounded-btn border border-base-content border-opacity-20 p-8">
									<ResearchGoal data={node} />
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</article>
		</li>
	{/each}
</ol>
