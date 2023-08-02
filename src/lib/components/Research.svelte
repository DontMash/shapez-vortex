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

	let isLoading: boolean = true;
	let viewer: MultiShapeViewer | undefined = undefined;
	let host: HTMLElement | undefined = undefined;
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
		if (!host) return console.warn('Host not provided');
		if (!canvas) return console.warn('Canvas not provided');

		try {
			const views: Array<ShapeViewOption> = Array.from(
				host.querySelectorAll<HTMLElement>('[data-view]')
			).map((element) => ({
				shape: element.dataset['viewShape']!,
				element
			}));
			viewer = new MultiShapeViewer(canvas, views);
		} catch (error) {
			const message = (error as Error).message;
			if (import.meta.env.DEV) {
				console.error(error);
			}
			add(message, 2000, ToastType.Error);
		}
	});
</script>

<div class="relative flex overflow-x-auto px-8 py-4" bind:this={host}>
	<ol class="flex space-x-24">
		{#each milestones as milestone}
			<li class="space-y-12">
				<ResearchCard
					type="milestone"
					prefix={`M${milestone.LevelIndex}`}
					title={milestone.Title}
					description={milestone.Description}
					goal={milestone.GoalShape ?? undefined}
					goalAmount={milestone.GoalAmount}
				>
					{#if isLoading}
						<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<Loading />
						</div>
					{/if}
				</ResearchCard>

				{#each milestone.categories as category}
					<ul>
						{#if category.nodes.length > 0 || category.upgrades.length > 0}
							<h2
								class={`${
									nodeColorVariants[category.id]
								} mb-4 inline-block rounded-full px-2.5 py-1.5 text-lg font-bold leading-none`}
							>
								{category.title}
							</h2>

							<li class="space-y-12">
								{#if category.nodes.length > 0}
									<ul class="space-y-12">
										{#each category.nodes as node}
											<li>
												<ResearchCard
													type="side-goal"
													category={category.id}
													prefix="Side-Goal:"
													title={node.Title}
													description={node.Description}
													goal={node.GoalShape ?? undefined}
													goalAmount={node.GoalAmount}
												>
													{#if isLoading}
														<div
															class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
														>
															<Loading />
														</div>
													{/if}
												</ResearchCard>
											</li>
										{/each}
									</ul>
								{/if}

								{#if category.upgrades.length > 0}
									<ul class="space-y-12">
										{#each category.upgrades as upgrade}
											<li>
												<ResearchCard
													type="upgrade"
													category={category.id}
													prefix="Upgrade:"
													title={upgrade.Title}
													description={upgrade.Description}
													goal={upgrade.GoalShape ?? undefined}
													goalAmount={upgrade.GoalAmount}
												>
													{#if isLoading}
														<div
															class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
														>
															<Loading />
														</div>
													{/if}
												</ResearchCard>
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/if}
					</ul>
				{/each}
			</li>
		{/each}
	</ol>

	<canvas class="pointer-events-none absolute inset-0 !m-0" bind:this={canvas} />
</div>
