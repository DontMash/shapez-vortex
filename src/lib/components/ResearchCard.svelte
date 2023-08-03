<script lang="ts">
	import {
		nodeColorVariants,
		upgradeColorVariants,
		type ResearchCategoryIdentifier,
		type ResearchType
	} from '$lib/research.types';

	export let type: ResearchType;
	export let category: ResearchCategoryIdentifier | undefined = undefined;
	export let prefix: string;
	export let title: string;
	export let description: string;
	export let goal: string | undefined = undefined;
	export let goalAmount: number | undefined = undefined;

	const colorVariants: Record<
		Exclude<ResearchType, 'milestone'>,
		Record<ResearchCategoryIdentifier, string>
	> = {
		'side-goal': nodeColorVariants,
		upgrade: upgradeColorVariants
	};
</script>

<article
	class="grid w-96 grid-cols-1 grid-rows-2 divide-y-2 divide-neutral-900 border-2 border-neutral-900 bg-stone-200 text-neutral-800 shadow-xl"
>
	<div class="flex flex-col p-2.5">
		<h2 class="text-xl font-bold">
			<span class="font-black">{prefix}</span>
			{@html title}
		</h2>
		<p class="text-sm">{description}</p>
	</div>

	<div
		class={`${
			type !== 'milestone' && category ? colorVariants[type][category] : 'bg-cyan-500'
		} flex h-32 divide-x-2 divide-neutral-900`}
	>
		{#if goal}
			<figure class="relative h-32 w-32 shrink-0 bg-neutral-900 select-none" data-view data-view-shape={goal}>
				<slot />
				<figcaption class="sr-only">{goal}</figcaption>
			</figure>

			{#if goalAmount}
				<div class="flex w-full flex-col items-start justify-center p-2.5">
					<i class="text-xl font-bold">{goalAmount}</i>
					<a
						class="break-all underline"
						href={`/shape?identifier=${goal}`}
						target="_blank"
						rel="noreferrer noopener"
					>
						{goal}
					</a>
				</div>
			{/if}
		{/if}
	</div>
</article>
