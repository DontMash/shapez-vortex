<script lang="ts">
	import type { ResearchGoal } from '$lib/research.types';

	export let data: ResearchGoal;
</script>

<figure class="space-y-2">
	<div class="flex space-x-4">
		<a class="min-w-fit" href={`/shape?identifier=${data.GoalShape}`}>
			<img width="96" height="96" src="/placeholder.png" alt={`Shape: ${data.GoalShape}`} />
		</a>
		<div class="flex flex-col">
			<span class="text-lg font-bold">{@html data.Title}</span>
			{#if data.GoalAmount}
				<i>
					#{data.GoalAmount}
				</i>
			{/if}
			{#if data.GoalShape}
				<a class="font-medium text-blue-900 underline break-all" href={`/shape?identifier=${data.GoalShape}`}
					>{data.GoalShape}</a
				>
			{/if}
		</div>
	</div>
	<p class="text-neutral-600">
		{@html data.Description}
	</p>
</figure>
