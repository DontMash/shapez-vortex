<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import {
		SHAPE_COLORS,
		SHAPE_TYPES,
		type ShapeColor,
		type ShapeData,
		type ShapeIdentifier
	} from '$lib/shape.types';
	import { create } from '$lib/client/user/database';
	import { share } from '$lib/client/actions/share';
	import { copy } from '$lib/client/actions/clipboard';

	import Dialog from '$lib/components/Dialog.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import AddIcon from '$lib/components/icons/AddIcon.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import GridViewIcon from '$lib/components/icons/GridViewIcon.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import OpacityIcon from '$lib/components/icons/OpacityIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';

	export let data: PageData;
	let update: boolean;
	let toDeleteBookmark: ShapeData | undefined;

	const colors: Record<ShapeColor, string> = {
		r: 'before:bg-[#ee3333]',
		g: 'before:bg-[#00ee00]',
		b: 'before:bg-[#0000ee]',
		c: 'before:bg-[#00eeee]',
		p: 'before:bg-[#cc00cc]',
		y: 'before:bg-[#eeee00]',
		k: 'before:bg-[#141414]',
		w: 'before:bg-[#fafafa]'
	};

	function getShapeViewURL(identifier: ShapeIdentifier): string {
		const url = new URL('shape', $page.url.origin);
		url.searchParams.append('identifier', identifier);
		return url.href;
	}
	function onDelete(bookmark: ShapeData) {
		toDeleteBookmark = bookmark;
	}
	async function deleteBookmark() {
		if (!toDeleteBookmark) return;

		const { shape } = await create();
		const { remove } = shape;
		await remove(toDeleteBookmark.identifier);

		toDeleteBookmark = undefined;
		update = !update;
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<article class="relative">
		<header
			class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 pb-4 pl-4 pr-8"
		>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<BookmarkIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
			<a
				class="!ml-auto inline-block h-14 w-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				title="Add shape"
				href="/shape"
			>
				<AddIcon />
				<span class="sr-only">Add</span>
			</a>
		</header>
		{#key update}
			{#await create() then { shape }}
				{#await shape.getAll()}
					<div class="absolute left-1/2 top-24 -translate-x-1/2 items-center justify-center">
						<Loading />
					</div>
				{:then bookmarks}
					{#if bookmarks.length > 0}
						<ol class="space-y-4">
							{#each bookmarks as bookmark}
								{@const url = getShapeViewURL(bookmark.identifier)}
								<li
									class="flex w-full rounded-[2rem] border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-8 shadow-lg"
								>
									<div class="flex w-full flex-col justify-between space-y-4">
										<span class="text-3xl font-bold">{bookmark.identifier}</span>
										<ul class="grid grid-cols-4 gap-6">
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-cyan-400 p-1"
												>
													<CategoryIcon />
												</span>
												<span class="sr-only">Types</span>
												<b class="text-lg"
													>{Array.from(bookmark.meta.types)
														.sort((a, b) => SHAPE_TYPES.indexOf(a) - SHAPE_TYPES.indexOf(b))
														.join(', ')}</b
												>
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-orange-400 p-1"
												>
													<OpacityIcon />
												</span>
												<span class="sr-only">Colors</span>
												{#if bookmark.meta.colors.size > 0}
													<ul class="grid auto-rows-auto grid-cols-4 gap-1">
														{#each Array.from(bookmark.meta.colors).sort((a, b) => SHAPE_COLORS.indexOf(a) - SHAPE_COLORS.indexOf(b)) as color}
															<li>
																<b
																	class={`${colors[color]} text-lg before:mr-1 before:inline-block before:h-3 before:w-3 before:rounded-full before:border-2 before:border-neutral-800`}
																>
																	{color}
																</b>
															</li>
														{/each}
													</ul>
												{:else}
													<b class="text-lg">-</b>
												{/if}
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-1"
												>
													<LayersIcon />
												</span>
												<span class="sr-only">Layers</span>
												<b class="text-lg">{bookmark.meta.layerCount}</b>
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-1"
												>
													<GridViewIcon />
												</span>
												<span class="sr-only">Quarters</span>
												<b class="text-lg">{bookmark.meta.quarterCount}</b>
											</li>
										</ul>
									</div>
									<div class="grid shrink-0 auto-rows-max grid-cols-2 gap-2">
										<a
											class="inline-block h-14 w-14 rounded-2xl border-2 border-cyan-800 bg-cyan-800 bg-opacity-70 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-opacity-50"
											title="View shape"
											href={url}
										>
											<VisibilityIcon />
											<span class="sr-only">View</span>
										</a>
										<button
											class="inline-block h-14 w-14 rounded-2xl border-2 border-red-800 bg-red-800 bg-opacity-70 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-opacity-50"
											title="Delete shape"
											on:click={() => onDelete(bookmark)}
										>
											<DeleteIcon />
											<span class="sr-only">Delete</span>
										</button>
										<button
											class="inline-block h-14 w-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
											title="Copy shape"
											use:copy={{ value: bookmark.identifier }}
										>
											<CopyIcon />
											<span class="sr-only">Copy</span>
										</button>
										<button
											class="inline-block h-14 w-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
											title="Share shape"
											use:share={{ href: url }}
										>
											<ShareFilledIcon />
											<span class="sr-only">Share</span>
										</button>
									</div>
								</li>
							{/each}
						</ol>
					{:else}
						<div class="flex items-center justify-center">
							<span>No shapes</span>
						</div>
					{/if}
				{/await}
			{/await}
		{/key}
	</article>

	<Dialog
		open={!!toDeleteBookmark}
		on:confirm={() => deleteBookmark()}
		on:cancel={() => (toDeleteBookmark = undefined)}
	>
		<h2 class="mb-6 text-4xl font-bold">Delete</h2>
		<p>
			Do you want to delete the shape "{toDeleteBookmark?.identifier}"?
		</p>
	</Dialog>
</section>
