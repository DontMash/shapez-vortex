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
	import { share } from '$lib/client/actions/share';
	import { copy } from '$lib/client/actions/clipboard';

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

	const shapes = new Promise<Array<any>>((resolve, _) => resolve([]));
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
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-4 pb-4"
	>
		<h2 class="inline-flex flex-grow items-center space-x-2 text-lg font-bold">
			<span class="inline-block h-6 w-6">
				<BookmarkIcon />
			</span>
			<span>
				{data.seo.title}
			</span>
		</h2>
		<a
			class="btn btn-square btn-ghost border border-base-content border-opacity-20 fill-base-content"
			title="Add shape"
			href="/shape"
		>
			<span class="sr-only">Add</span>
			<span class="inline-block h-6 w-6">
				<AddIcon />
			</span>
		</a>
	</header>

	{#await shapes}
		<div class="absolute left-1/2 top-24 -translate-x-1/2 items-center justify-center">
			<span class="loading loading-spinner loading-lg" />
		</div>
	{:then bookmarks}
		{#if bookmarks.length > 0}
			<ol class="space-y-4">
				{#each bookmarks as bookmark}
					{@const url = getShapeViewURL(bookmark.identifier)}
					<li>
						<article
							class="flex w-full rounded-4xl border border-base-content border-opacity-20 bg-base-200 p-8 shadow-lg"
						>
							<div class="flex w-full flex-col justify-between space-y-4">
								<h2 class="text-3xl font-bold">{bookmark.identifier}</h2>
								<ul class="grid grid-cols-4 gap-4">
									<li class="inline-flex items-center space-x-2">
										<span
											class="inline-block h-10 w-10 rounded-btn border border-base-content border-opacity-20 fill-primary p-2"
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
											class="inline-block h-10 w-10 rounded-btn border border-base-content border-opacity-20 fill-secondary p-2"
										>
											<OpacityIcon />
										</span>
										<span class="sr-only">Colors</span>
										{#if bookmark.meta.colors.size > 0}
											<ul class="grid auto-rows-auto grid-cols-4 gap-1">
												{#each Array.from(bookmark.meta.colors).sort((a, b) => SHAPE_COLORS.indexOf(a) - SHAPE_COLORS.indexOf(b)) as color}
													<li>
														<b
															class={`${colors[color]} text-lg before:mr-1 before:inline-block before:h-2 before:w-2 before:rounded-full before:border before:border-base-content before:border-opacity-20`}
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
											class="inline-block h-10 w-10 rounded-btn border border-base-content border-opacity-20 p-2"
										>
											<LayersIcon />
										</span>
										<span class="sr-only">Layers</span>
										<b class="text-lg">{bookmark.meta.layerCount}</b>
									</li>
									<li class="inline-flex items-center space-x-2">
										<span
											class="inline-block h-10 w-10 rounded-btn border border-base-content border-opacity-20 p-2"
										>
											<GridViewIcon />
										</span>
										<span class="sr-only">Quarters</span>
										<b class="text-lg">{bookmark.meta.quarterCount}</b>
									</li>
								</ul>
							</div>
							<div class="grid shrink-0 auto-rows-max grid-cols-2 gap-2 self-center">
								<a
									class="btn btn-square btn-primary fill-primary-content"
									title="View shape"
									href={url}
								>
									<span class="sr-only">View</span>
									<span class="inline-block h-6 w-6">
										<VisibilityIcon />
									</span>
								</a>
								<button
									class="btn btn-square btn-error"
									title="Delete shape"
								>
									<span class="sr-only">Delete</span>
									<span class="inline-block h-6 w-6">
										<DeleteIcon />
									</span>
								</button>
								<button
									class="btn btn-square btn-accent fill-accent-content"
									title="Copy shape"
									use:copy={{ value: bookmark.identifier }}
								>
									<span class="sr-only">Copy</span>
									<span class="inline-block h-6 w-6">
										<CopyIcon />
									</span>
								</button>
								<button
									class="btn btn-square btn-accent fill-accent-content"
									title="Share shape"
									use:share={{ href: url }}
								>
									<span class="sr-only">Share</span>
									<span class="inline-block h-6 w-6">
										<ShareFilledIcon />
									</span>
								</button>
							</div>
						</article>
					</li>
				{/each}
			</ol>
		{:else}
			<div class="text-center">
				<span>No bookmarked shapes</span>
			</div>
		{/if}
	{/await}
</section>
