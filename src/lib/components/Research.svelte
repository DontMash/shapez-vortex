<script lang="ts">
	import { onMount } from 'svelte';

	import { MultiShapeViewer, type ShapeViewOption } from 'shapez-viewer';
	import { ToastType, add } from './toast/toast.service';
	import {
		nodeColorVariants,
		type ResearchCategoryIdentifier,
		type ResearchEntry
	} from '$lib/research.types';

	import Loading from './Loading.svelte';
	import ResearchCard from './ResearchCard.svelte';

	import research from '$lib/assets/data/research-metadata.json';

	type ResearchCategory = {
		id: ResearchCategoryIdentifier;
		title: string;
		nodes: Array<ResearchEntry>;
		upgrades: Array<ResearchEntry>;
	};
	type Milestone = ResearchEntry & {
		categories: Array<ResearchCategory>;
	};

	const milestones: Array<Milestone> = research.Levels.map((current) => {
		const categories: Array<ResearchCategory> = research.Categories.map((category) => {
			const nodes = category.Nodes.filter((node) => node.DependentLevelId === current.Id);
			const upgrades = category.Upgrades.filter(
				(upgrade) => upgrade.DependentLevelId === current.Id
			);
			return {
				id: category.Id as ResearchCategoryIdentifier,
				title: category.Title,
				nodes,
				upgrades
			};
		});
		return {
			...(current as ResearchEntry),
			categories
		};
	});
	const views: Record<string, Partial<ShapeViewOption>> = milestones.reduce((views, current) => {
		if (!current.GoalShape) return views;

		views[current.Id] = { shape: current.GoalShape };
		const entries = current.categories.flatMap((category) => {
			return category.nodes.concat(category.upgrades);
		});
		entries.forEach((entry) => {
			if (!entry.GoalShape) return;

			views[entry.Id] = { shape: entry.GoalShape };
		});

		return views;
	}, {} as Record<string, Partial<ShapeViewOption>>);

	let isLoading: boolean = true;
	let viewer: MultiShapeViewer | undefined = undefined;
	let canvas: HTMLCanvasElement | undefined = undefined;

	$: {
		viewer
			?.init()
			.then(() => {
				isLoading = false;
			})
			.catch((reason: any) => {
				const error = reason as Error;
				if (import.meta.env.DEV) {
					console.error(error);
				}
				add(error.message, 2000, ToastType.Error);
			});
	}
	onMount(() => {
		if (!canvas) return console.warn('Canvas not provided');

		try {
			const options = Object.values(views).filter(
				(option) => !!option.shape
			) as Array<ShapeViewOption>;
			viewer = new MultiShapeViewer(canvas, options);
		} catch (error) {
			const message = (error as Error).message;
			if (import.meta.env.DEV) {
				console.error(error);
			}
			add(message, 2000, ToastType.Error);
		}
	});
</script>

<div class="relative flex overflow-x-auto px-8 py-4">
	<ul class="flex space-x-24">
		{#each milestones as milestone}
			<li class="space-y-16">
				<ResearchCard
					type="milestone"
					prefix={`M${milestone.LevelIndex}`}
					title={milestone.Title}
					subtitle={milestone.Id}
					description={milestone.Description}
					goal={milestone.GoalShape ?? undefined}
					goalAmount={milestone.GoalAmount}
				>
					<figure
						class="relative h-32 w-32 shrink-0 bg-neutral-900"
						bind:this={views[milestone.Id].element}
					>
						{#if isLoading}
							<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<Loading />
							</div>
						{/if}
						<figcaption class="sr-only">{milestone.GoalShape}</figcaption>
					</figure>
				</ResearchCard>

				<ul class="space-y-16">
					{#each milestone.categories as category}
						{#if category.nodes.length > 0 || category.upgrades.length > 0}
							<li class="space-y-4">
								<h2
									class={`${
										nodeColorVariants[category.id]
									} inline-block rounded-full px-2.5 py-1.5 text-lg font-bold leading-none`}
								>
									{category.title}
								</h2>

								{#each category.nodes as node}
									<ResearchCard
										type="side-goal"
										category={category.id}
										prefix="Side-Goal:"
										title={node.Title}
										subtitle={node.Id}
										description={node.Description}
										goal={node.GoalShape ?? undefined}
										goalAmount={node.GoalAmount}
									>
										<figure
											class="relative h-32 w-32 shrink-0 bg-neutral-900"
											bind:this={views[node.Id].element}
										>
											{#if isLoading}
												<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
													<Loading />
												</div>
											{/if}
											<figcaption class="sr-only">{node.GoalShape}</figcaption>
										</figure>
									</ResearchCard>
								{/each}

								{#each category.upgrades as upgrade}
									<ResearchCard
										type="upgrade"
										category={category.id}
										prefix="Upgrade:"
										title={upgrade.Title}
										subtitle={upgrade.Id}
										description={upgrade.Description}
										goal={upgrade.GoalShape ?? undefined}
										goalAmount={upgrade.GoalAmount}
									>
										<figure
											class="relative h-32 w-32 shrink-0 bg-neutral-900"
											bind:this={views[upgrade.Id].element}
										>
											{#if isLoading}
												<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
													<Loading />
												</div>
											{/if}
											<figcaption class="sr-only">{upgrade.GoalShape}</figcaption>
										</figure>
									</ResearchCard>
								{/each}
							</li>
						{/if}
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<canvas class="pointer-events-none absolute inset-0 !m-0" bind:this={canvas} />
</div>
