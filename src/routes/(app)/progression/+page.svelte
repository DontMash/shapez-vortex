<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { SOURCES, TRIGGERS, dndzone, type DndEvent } from 'svelte-dnd-action';
	import _ from 'lodash';
	import { v4 as uuidv4 } from 'uuid';
	import { TOAST_TYPE, add } from '$lib/client/toast/toast.service';
	import type { Scenario } from '$lib/game.types';
	import {
		PROGRESSION_MILESTONE_CREATE_SCHEMA,
		PROGRESSION_REWARDS,
		PROGRESSION_REWARD_TYPES,
		type Progression,
		type ProgressionGoal,
		type ProgressionLinearUpgrade,
		type ProgressionMilestone,
		type ProgressionReward,
		type ProgressionSideGoalGroup,
		type ProgressionSideUpgrade
	} from '$lib/progression.types';
	import type { PageData } from './$types';

	import DEFAULT_SCENARIO from '$lib/assets/data/DefaultScenario.json';

	import Dialog from '$lib/components/Dialog.svelte';
	import ShapeImage from '$lib/components/shape/ShapeImage.svelte';
	import AddIcon from '$lib/components/icons/AddIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import FileDownloadIcon from '$lib/components/icons/FileDownloadIcon.svelte';
	import FileUploadIcon from '$lib/components/icons/FileUploadIcon.svelte';
	import PersonalPlaceIcon from '$lib/components/icons/PersonalPlaceIcon.svelte';
	import TimelineIcon from '$lib/components/icons/TimelineIcon.svelte';

	type ProgressionMilestoneItem = {
		id: string;
		ref: ProgressionMilestone;
		rewards: Array<ProgressionRewardItem | ProgressionUpgradeItem>;
		goals: Array<ProgressionGoalItem>;
		tasks: Array<ProgressionTaskItem>;
	};
	type ProgressionRewardItem = {
		id: string;
		ref: ProgressionReward;
	};
	type ProgressionUpgradeItem = {
		id: string;
		ref: ProgressionSideUpgrade | ProgressionLinearUpgrade;
	};
	type ProgressionGoalItem = {
		id: string;
		title: string;
		ref: ProgressionGoal;
	};
	type ProgressionTaskItem = {
		id: string;
		title: string;
		ref: ProgressionSideGoalGroup;
	};

	const FLIP_ANIMATION_DURATION_MS = 300;
	const FILE_NAME = 'DefaultScenario.json';

	export let data: PageData;

	let scenario: Scenario | undefined;
	let milestoneItems: Array<ProgressionMilestoneItem> = [];
	let milestoneDragDisabled = true;

	let milestoneDialog: Dialog | undefined;
	let milestoneIndex: number | undefined;
	let rewardDialog: Dialog | undefined;

	let availableRewards: Array<
		ProgressionReward | ProgressionSideUpgrade | ProgressionLinearUpgrade
	> = [];
	$: {
		const usedRewards = milestoneItems.flatMap((milestoneItem) =>
			milestoneItem.rewards.map((rewardItem) => rewardItem.ref)
		);
		availableRewards = PROGRESSION_REWARDS.filter((reward) => {
			return usedRewards.filter((usedReward) => {
				if (!('$type' in usedReward) || reward.$type !== usedReward.$type) {
					return false;
				}
				if (
					reward.$type === 'BuildingReward' &&
					usedReward.$type === 'BuildingReward' &&
					reward.BuildingVariantId === usedReward.BuildingVariantId
				) {
					return false;
				}
				if (
					reward.$type === 'IslandLayoutReward' &&
					usedReward.$type === 'IslandLayoutReward' &&
					reward.LayoutId === usedReward.LayoutId
				) {
					return false;
				}
				if (
					reward.$type === 'MechanicReward' &&
					usedReward.$type === 'MechanicReward' &&
					reward.MechanicId === usedReward.MechanicId
				) {
					return false;
				}
				if (
					reward.$type === 'WikiEntryReward' &&
					usedReward.$type === 'WikiEntryReward' &&
					reward.EntryId === usedReward.EntryId
				) {
					return false;
				}
				return true;
			}).length;
		});
	}

	function onFileLoad(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		if (!input || !input.files || input.files.length < 1) {
			return add('No file provided', 3000, TOAST_TYPE.WARNING);
		}

		const file = input.files.item(0);
		if (!file) {
			return add('Invalid file provided', 3000, TOAST_TYPE.ERROR);
		}

		file
			.text()
			.then((value) => {
				input.value = '';
				const scenario = JSON.parse(value) as Scenario;
				onLoad(scenario);
			})
			.catch((_) => add('Cannot parse file', 3000, TOAST_TYPE.ERROR));
	}
	function onLoad(newScenario: Scenario) {
		scenario = newScenario;
		const quests = scenario.Progression.SideQuestGroups;
		const sideUpgrades = scenario.Progression.SideUpgrades;
		const linearUpgrades = scenario.Progression.LinearUpgrades;

		milestoneItems = scenario.Progression.Levels.map<ProgressionMilestoneItem>(
			(level, levelIndex) => {
				const levelQuests = quests.filter((group) => group.RequiredUpgradeIds.includes(level.Id));
				const levelSideUpgrades = sideUpgrades.filter((upgrade) =>
					upgrade.RequiredUpgradeIds.includes(level.Id)
				);
				const levelLinearUpgrades = linearUpgrades.filter(
					(upgrade) => upgrade.RequiredUpgradeId === level.Id
				);

				const levelRewards = level.Rewards.map<ProgressionRewardItem>((reward) => {
					return {
						id: uuidv4(),
						ref: reward
					};
				});
				const sideUpgradeRewards = levelSideUpgrades.map<ProgressionUpgradeItem>((upgrade) => {
					return {
						id: uuidv4(),
						ref: upgrade
					};
				});
				const linearUpgradeRewards = levelLinearUpgrades.map<ProgressionUpgradeItem>((upgrade) => {
					return {
						id: uuidv4(),
						ref: upgrade
					};
				});

				return {
					id: uuidv4(),
					ref: level,
					rewards: [...levelRewards, ...sideUpgradeRewards, ...linearUpgradeRewards],
					goals: level.Lines.map((line, lineIndex) => {
						return {
							id: uuidv4(),
							title: `GOAL_${String(levelIndex).padStart(2, '0')}${String(lineIndex).padStart(
								2,
								'0'
							)}`,
							ref: line
						};
					}),
					tasks: levelQuests.map((quest, questIndex) => {
						return {
							id: uuidv4(),
							title: `TASK_${String(levelIndex).padStart(2, '0')}${String(questIndex).padStart(
								2,
								'0'
							)}`,
							ref: quest
						};
					})
				};
			}
		);
	}
	function onFileSave() {
		if (!scenario) {
			return add('No scenario available', 3000, TOAST_TYPE.WARNING);
		}

		const progression = milestoneItems.reduce<Progression>(
			(result, current) => {
				const rewards: Array<ProgressionReward> = current.rewards
					.filter((item) => '$type' in item.ref)
					.map((item) => item.ref as ProgressionReward);
				const level: ProgressionMilestone = {
					...current.ref,
					Rewards: rewards,
					Lines: current.goals.map((goal) => goal.ref)
				};
				const upgrades = current.rewards
					.filter((item) => !('$type' in item.ref))
					.map((item) => item.ref as ProgressionSideUpgrade | ProgressionLinearUpgrade);
				const sideUpgrades = upgrades.filter(
					(upgrade) => 'Rewards' in upgrade
				) as Array<ProgressionSideUpgrade>;
				const linearUpgrades = upgrades.filter(
					(upgrade) => !('Rewards' in upgrade)
				) as Array<ProgressionLinearUpgrade>;

				result.Levels.push(level);
				result.SideQuestGroups.push(
					...current.tasks.map<ProgressionSideGoalGroup>((task) => ({
						...task.ref,
						RequiredUpgradeIds: [current.ref.Id]
					}))
				);
				result.SideUpgrades.push(...sideUpgrades);
				result.LinearUpgrades.push(...linearUpgrades);
				return result;
			},
			{
				Levels: [],
				SideQuestGroups: [],
				SideUpgrades: [],
				LinearUpgrades: []
			}
		);
		const newScenario: Scenario = { ...scenario, Progression: progression };
		const content = JSON.stringify(newScenario, undefined, 4);
		const file = new Blob([content], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(file);
		link.download = FILE_NAME;
		link.click();
		URL.revokeObjectURL(link.href);
	}
	function onDelete() {
		scenario = undefined;
		milestoneItems = [];
	}

	function onCreateMilestone(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const result = PROGRESSION_MILESTONE_CREATE_SCHEMA.safeParse(Object.fromEntries(formData));
		if (!result.success) {
			add('Invalid milestone data', 3000, TOAST_TYPE.ERROR);
		} else {
			milestoneItems.push({
				id: uuidv4(),
				ref: result.data,
				rewards: [],
				goals: [],
				tasks: []
			});
			milestoneItems = milestoneItems;
		}
		form.reset();
		milestoneDialog?.close();
	}
	function onAddReward(event: SubmitEvent) {}

	function onRemoveMilestone(milestoneIndex: number) {
		milestoneItems.splice(milestoneIndex, 1);
		milestoneItems = milestoneItems;
	}
	function onRemoveMilestoneReward(milestoneIndex: number, rewardIndex: number) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.rewards.splice(rewardIndex, 1);
		milestoneItems = milestoneItems;
	}
	function onRemoveMilestoneGoal(milestoneIndex: number, goalIndex: number) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.goals.splice(goalIndex, 1);
		milestoneItems = milestoneItems;
	}
	function onRemoveMilestoneTask(milestoneIndex: number, taskIndex: number) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.tasks.splice(taskIndex, 1);
		milestoneItems = milestoneItems;
	}

	function onShowRewardDialog(index: number) {
		milestoneIndex = index;
		rewardDialog?.show();
	}

	function onDragMilestoneConsider(event: CustomEvent<DndEvent<ProgressionMilestoneItem>>) {
		const {
			items,
			info: { source, trigger }
		} = event.detail;
		milestoneItems = items;
		// Ensure dragging is stopped on drag finish via keyboard
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			milestoneDragDisabled = true;
		}
	}
	function onDragMilestoneFinalize(event: CustomEvent<DndEvent<ProgressionMilestoneItem>>) {
		const {
			items,
			info: { source }
		} = event.detail;
		milestoneItems = items;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			milestoneDragDisabled = true;
		}
	}
	function onStartDragMilestone(event: Event) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		event.preventDefault();
		milestoneDragDisabled = false;
	}
	function onDragMilestoneKey(event: KeyboardEvent) {
		if ((event.key === 'Enter' || event.key === ' ') && milestoneDragDisabled)
			milestoneDragDisabled = false;
	}
	function onDragMilestoneReward(
		event: CustomEvent<DndEvent<ProgressionRewardItem | ProgressionUpgradeItem>>,
		milestoneIndex: number
	) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.rewards = event.detail.items;
		milestoneItems = milestoneItems;
	}
	function onDragMilestoneGoal(
		event: CustomEvent<DndEvent<ProgressionGoalItem>>,
		milestoneIndex: number
	) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.goals = event.detail.items;
		milestoneItems = milestoneItems;
	}
	function onDragMilestoneTask(
		event: CustomEvent<DndEvent<ProgressionTaskItem>>,
		milestoneIndex: number
	) {
		const milestone = milestoneItems.at(milestoneIndex);
		if (!milestone) return;

		milestone.tasks = event.detail.items;
		milestoneItems = milestoneItems;
	}

	onMount(() => {
		onLoad(DEFAULT_SCENARIO as any as Scenario);
	});
</script>

<section>
	<div class="mx-auto w-full max-w-5xl">
		<header
			class="mx-auto mb-12 flex items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
		>
			<hgroup>
				<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
					<span class="inline-block size-6 fill-base-content">
						<TimelineIcon />
					</span>
					<span>
						{data.seo.title}
					</span>
				</h2>
				<p>
					{data.seo.description}
				</p>
			</hgroup>
		</header>

		<div class="mb-8 flex space-x-2">
			<label class="btn btn-square btn-primary" for="scenario-file">
				<input
					class="sr-only"
					id="scenario-file"
					name="scenario"
					type="file"
					accept=".json"
					required
					on:change={onFileLoad}
				/>
				<span class="sr-only">Load progression</span>
				<span class="inline-block size-6 fill-primary-content">
					<FileUploadIcon />
				</span>
			</label>

			{#if milestoneItems.length > 0}
				<button class="btn btn-square btn-primary" type="button" on:click={onFileSave}>
					<span class="sr-only">Save progression</span>
					<span class="inline-block size-6 fill-primary-content">
						<FileDownloadIcon />
					</span>
				</button>

				<button class="btn btn-square btn-error" type="button" on:click={onDelete}>
					<span class="sr-only">Save progression</span>
					<span class="inline-block size-6 fill-primary-content">
						<DeleteIcon />
					</span>
				</button>
			{/if}
		</div>
	</div>

	<ol
		class="slider items-start space-x-8 rounded-2xl py-1 -my-1"
		aria-label="Milestones"
		use:dndzone={{
			items: milestoneItems,
			dragDisabled: milestoneDragDisabled,
			dropTargetStyle: {},
			dropTargetClasses: ['outline', 'outline-base-content'],
			flipDurationMs: FLIP_ANIMATION_DURATION_MS,
			type: 'milestone'
		}}
		on:consider={onDragMilestoneConsider}
		on:finalize={onDragMilestoneFinalize}
	>
		{#each milestoneItems as milestoneItem, milestoneIndex (milestoneItem.id)}
			{@const milestoneLabel = `Milestone ${milestoneItem.ref.Title} (${milestoneItem.ref.Id})`}
			<li
				class="w-full max-w-[32rem] rounded-2xl shrink-0 shadow-lg"
				aria-label={milestoneLabel}
				animate:flip={{ duration: FLIP_ANIMATION_DURATION_MS }}
			>
				<article class="rounded-inherit bg-base-200">
					<header
						class="space-y-2 rounded-inherit bg-base-300 p-6 shadow-lg"
						aria-label="drag-handle"
						role="button"
						tabindex="0"
						style={milestoneDragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
						on:mousedown={onStartDragMilestone}
						on:touchstart={onStartDragMilestone}
						on:keydown={onDragMilestoneKey}
					>
						<h3 class="flex items-center space-x-2">
							<span class="inline-block size-6 shrink-0">
								<PersonalPlaceIcon />
							</span>
							<span class="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold"
								>{milestoneLabel}</span
							>
							<button
								class="btn btn-square btn-ghost btn-sm !ml-auto p-0.5"
								type="button"
								on:click={() => onRemoveMilestone(milestoneIndex)}
							>
								<CloseIcon />
							</button>
						</h3>
					</header>

					<section class="space-y-2 p-6">
						<h4>Rewards</h4>

						<ul
							class="space-y-2 rounded-2xl bg-base-100 p-4 shadow-lg"
							aria-label="{milestoneLabel} rewards"
							use:dndzone={{
								items: milestoneItem.rewards,
								flipDurationMs: FLIP_ANIMATION_DURATION_MS,
								dropTargetStyle: {},
								dropTargetClasses: ['outline', 'outline-base-content'],
								type: 'reward'
							}}
							on:consider={(event) => onDragMilestoneReward(event, milestoneIndex)}
							on:finalize={(event) => onDragMilestoneReward(event, milestoneIndex)}
						>
							{#each milestoneItem.rewards as reward, rewardIndex (reward.id)}
								<li animate:flip={{ duration: FLIP_ANIMATION_DURATION_MS }}>
									<div class="flex h-12 items-center justify-between rounded-md bg-base-300 px-4">
										<span class="overflow-hidden text-ellipsis whitespace-nowrap">
											{#if !('$type' in reward.ref)}
												[UPGRADE] {reward.ref.Id}
											{:else if reward.ref.$type === PROGRESSION_REWARD_TYPES.BUILDING}
												[BUILDING] {reward.ref.BuildingVariantId}
											{:else if reward.ref.$type === PROGRESSION_REWARD_TYPES.ISLAND_LAYOUT}
												[LAYOUT] {reward.ref.LayoutId}
											{:else if reward.ref.$type === PROGRESSION_REWARD_TYPES.WIKI_ENTRY}
												[WIKI] {reward.ref.EntryId}
											{:else if reward.ref.$type === PROGRESSION_REWARD_TYPES.MECHANIC}
												[MECHANIC] {reward.ref.MechanicId}
											{:else}
												[{reward.ref.$type.toUpperCase()}] {reward.ref.Amount}
											{/if}
										</span>
										<button
											class="btn btn-square btn-ghost btn-sm p-0.5"
											type="button"
											on:click={() => onRemoveMilestoneReward(milestoneIndex, rewardIndex)}
										>
											<CloseIcon />
										</button>
									</div>
								</li>
							{/each}
							<button
								class="btn btn-block rounded-md shadow-lg"
								type="button"
								on:click={() => onShowRewardDialog(milestoneIndex)}
							>
								<span class="inline-block size-6">
									<AddIcon />
								</span>
								Add reward
							</button>
						</ul>
					</section>

					<section class="space-y-2 p-6">
						<h4>Goals</h4>

						<ul
							class="space-y-2 rounded-2xl bg-base-100 p-4 shadow-lg"
							aria-label="{milestoneLabel} goals"
							use:dndzone={{
								items: milestoneItem.goals,
								flipDurationMs: FLIP_ANIMATION_DURATION_MS,
								dropTargetStyle: {},
								dropTargetClasses: ['outline', 'outline-base-content'],
								type: 'goal'
							}}
							on:consider={(event) => onDragMilestoneGoal(event, milestoneIndex)}
							on:finalize={(event) => onDragMilestoneGoal(event, milestoneIndex)}
						>
							{#each milestoneItem.goals as goal, goalIndex (goal.id)}
								<li animate:flip={{ duration: FLIP_ANIMATION_DURATION_MS }}>
									<div class="flex h-32 items-center justify-between rounded-md bg-base-300 p-4">
										<span class="writing-vertical text-orientation-mixed rotate-180 leading-none">
											{goal.title}
										</span>
										<ol class="ml-4 flex grow space-x-2 overflow-x-auto scrollbar-hide">
											{#each goal.ref.Shapes as shape}
												<li class="flex flex-col items-center">
													<ShapeImage identifier={shape.Shape} />
													<i>{shape.Amount}</i>
												</li>
											{/each}
										</ol>
										<button
											class="btn btn-square btn-ghost btn-sm self-start p-0.5"
											type="button"
											on:click={() => onRemoveMilestoneGoal(milestoneIndex, goalIndex)}
										>
											<CloseIcon />
										</button>
									</div>
								</li>
							{/each}
							<button class="btn btn-block rounded-md shadow-lg" type="button">
								<span class="inline-block size-6">
									<AddIcon />
								</span>
								Add goal
							</button>
						</ul>
					</section>

					<section class="space-y-2 p-6">
						<h4>Tasks</h4>

						<ul
							class="space-y-2 rounded-2xl bg-base-100 p-4 shadow-lg"
							aria-label="{milestoneLabel} tasks"
							use:dndzone={{
								items: milestoneItem.tasks,
								flipDurationMs: FLIP_ANIMATION_DURATION_MS,
								dropTargetStyle: {},
								dropTargetClasses: ['outline', 'outline-base-content'],
								type: 'task'
							}}
							on:consider={(event) => onDragMilestoneTask(event, milestoneIndex)}
							on:finalize={(event) => onDragMilestoneTask(event, milestoneIndex)}
						>
							{#each milestoneItem.tasks as task, taskIndex (task.id)}
								<li animate:flip={{ duration: FLIP_ANIMATION_DURATION_MS }}>
									<div class="flex h-32 items-center justify-between rounded-md bg-base-300 p-4">
										<span class="writing-vertical text-orientation-mixed rotate-180 leading-none">
											{task.title}
										</span>
										<ol class="ml-4 flex grow space-x-2 overflow-x-auto scrollbar-hide">
											{#each task.ref.SideQuests as quest}
												{#each quest.Costs as cost}
													<li class="flex flex-col items-center">
														<ShapeImage identifier={cost.Shape} />
														<i>{cost.Amount}</i>
													</li>
												{/each}
											{/each}
										</ol>
										<button
											class="btn btn-square btn-ghost btn-sm self-start p-0.5"
											type="button"
											on:click={() => onRemoveMilestoneTask(milestoneIndex, taskIndex)}
										>
											<CloseIcon />
										</button>
									</div>
								</li>
							{/each}
							<button class="btn btn-block rounded-md shadow-lg" type="button">
								<span class="inline-block size-6">
									<AddIcon />
								</span>
								Add task
							</button>
						</ul>
					</section>
				</article>
			</li>
		{/each}

		<button class="btn btn-primary" type="button" on:click={() => milestoneDialog?.show()}>
			<span class="inline-block size-6">
				<AddIcon />
			</span>
			Create milestone
		</button>
	</ol>
</section>

<Dialog bind:this={milestoneDialog}>
	<div class="p-6">
		<header class="mb-4 pr-8">
			<span class="text-2xl font-bold">Add milestone</span>
		</header>
		<form class="space-y-4" on:submit|preventDefault={onCreateMilestone}>
			<label class="form-control w-full" for="id">
				<div class="label">
					<span class="label-text">Identifier</span>
				</div>
				<input
					class="input input-bordered w-full placeholder:italic"
					type="text"
					name="id"
					id="id"
					required
					placeholder="MILE ..."
				/>
			</label>
			<label class="form-control w-full" for="title">
				<div class="label">
					<span class="label-text">
						Title <span class="text-xs text-base-300">(optional)</span>
					</span>
				</div>
				<input
					class="input input-bordered w-full placeholder:italic"
					type="text"
					name="title"
					id="title"
					placeholder="Milestone ..."
				/>
			</label>
			<label class="form-control h-64 w-full" for="description">
				<div class="label">
					<span class="label-text">
						Description <span class="text-xs text-base-300">(optional)</span>
					</span>
				</div>
				<textarea
					class="textarea textarea-bordered h-full resize-none p-4 text-base placeholder:italic"
					name="description"
					id="description"
					placeholder="This milestone challenges ..."
				/>
			</label>
			<div class="flex items-center justify-end space-x-2 pt-4">
				<button class="btn btn-primary">
					<span class="inline-block size-6">
						<AddIcon />
					</span>
					Create
				</button>
				<form method="dialog">
					<button class="btn btn-neutral">
						<span class="inline-block size-6">
							<CloseIcon />
						</span>
						Cancel
					</button>
				</form>
			</div>
		</form>
	</div>
</Dialog>

<Dialog bind:this={rewardDialog}>
	<div class="p-6">
		<header class="mb-4 pr-8">
			<span class="text-2xl font-bold">Add reward</span>
		</header>
		<ul class="p-1 -m-1 max-h-[22.5rem] space-y-2 overflow-y-auto rounded-btn">
			{#each availableRewards as reward}
				<li>
					<button class="btn btn-block justify-start">
						<span class="overflow-hidden text-ellipsis whitespace-nowrap">
							{#if !('$type' in reward)}
								[UPGRADE] {reward.Id}
							{:else if reward.$type === PROGRESSION_REWARD_TYPES.BUILDING}
								[BUILDING] {reward.BuildingVariantId}
							{:else if reward.$type === PROGRESSION_REWARD_TYPES.ISLAND_LAYOUT}
								[LAYOUT] {reward.LayoutId}
							{:else if reward.$type === PROGRESSION_REWARD_TYPES.WIKI_ENTRY}
								[WIKI] {reward.EntryId}
							{:else if reward.$type === PROGRESSION_REWARD_TYPES.MECHANIC}
								[MECHANIC] {reward.MechanicId}
							{:else}
								[{reward.$type.toUpperCase()}] {reward.Amount}
							{/if}
						</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</Dialog>
