<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import {
		BLUEPRINT_DEFAULT_NAME,
		BLUEPRINT_FORM_SCHEMA,
		BLUEPRINT_TAGS_REGEX,
		type BlueprintData,
		type BlueprintIdentifier
	} from '$lib/blueprint.types';
	import { create } from '$lib/client/user/database';
	import { copy } from '$lib/client/actions/clipboard';
	import { share } from '$lib/client/actions/share';

	import Dialog from '$lib/components/Dialog.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import AddIcon from '$lib/components/icons/AddIcon.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import CurrencyBitcoinIcon from '$lib/components/icons/CurrencyBitcoinIcon.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import DashboardCustomizeFilledIcon from '$lib/components/icons/DashboardCustomizeFilledIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import DomainIcon from '$lib/components/icons/DomainIcon.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';
	import TitleIcon from '$lib/components/icons/TitleIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';

	export let data: PageData;
	let update: boolean;
	let toEditBookmark: BlueprintData | undefined;
	let toDeleteBookmark: BlueprintData | undefined;

	function getBlueprintViewURL(identifier: BlueprintIdentifier): string {
		const url = new URL('blueprint/view', $page.url.origin);
		url.searchParams.append('identifier', identifier);
		return url.href;
	}
	function onDelete(bookmark: BlueprintData) {
		toDeleteBookmark = bookmark;
	}
	async function deleteBookmark() {
		if (!toDeleteBookmark) return;

		const { blueprint } = await create();
		const { remove } = blueprint;
		await remove(toDeleteBookmark.identifier);

		toDeleteBookmark = undefined;
		update = !update;
	}
	function onEdit(bookmark: BlueprintData) {
		toEditBookmark = bookmark;
	}
	async function updateBookmark(name: string, tags?: Set<string> | undefined) {
		if (!toEditBookmark) return;

		{
			const { blueprint } = await create();
			const { update } = blueprint;

			await update({
				...toEditBookmark,
				meta: { ...toEditBookmark.meta, name, tags }
			});
		}
		update = !update;
	}
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
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
			title="Add blueprint"
			href="/blueprint"
		>
			<AddIcon />
			<span class="sr-only">Add</span>
		</a>
	</header>

	{#key update}
		{#await create() then { blueprint }}
			{#await blueprint.getAll()}
				<div class="absolute left-1/2 top-24 -translate-x-1/2 items-center justify-center">
					<Loading />
				</div>
			{:then bookmarks}
				{#if bookmarks.length > 0}
					<ol class="space-y-4">
						{#each bookmarks as bookmark}
							{@const type = bookmark.data.BP.$type}
							{@const url = getBlueprintViewURL(bookmark.identifier)}
							<li>
								<article
									class="flex w-full rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-8 shadow-lg"
								>
									<div class="flex w-full flex-col justify-between space-y-4">
										<div class="space-y-2">
											<h3 class="text-3xl font-bold">
												{bookmark.meta.name || BLUEPRINT_DEFAULT_NAME}
											</h3>
											{#if bookmark.meta.tags}
												<ul class="flex space-x-1">
													{#each Array.from(bookmark.meta.tags) as tag}
														<li
															class="rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 px-2 py-0.5 font-medium text-cyan-400"
														>
															#{tag}
														</li>
													{/each}
												</ul>
											{/if}
										</div>
										<ul class="grid grid-cols-4 gap-6">
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-cyan-400 p-1"
												>
													<TitleIcon />
												</span>
												<span class="sr-only">Type</span>
												<b class="text-lg">{type}</b>
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-orange-400 p-1"
												>
													<CurrencyBitcoinIcon />
												</span>
												<span class="sr-only">Blueprint cost</span>
												<b class="text-lg">{bookmark.meta.cost}</b>
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-1"
												>
													<DomainIcon />
												</span>
												<span class="sr-only">Building count</span>
												<b class="text-lg">{bookmark.meta.buildingCount}</b>
											</li>
											<li class="inline-flex items-center space-x-2">
												<span
													class="inline-block h-10 w-10 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-1"
												>
													<DashboardCustomizeFilledIcon />
												</span>
												<span class="sr-only">Island count</span>
												<b class="text-lg">{type === 'Island' ? bookmark.meta.islandCount : '-'}</b>
											</li>
										</ul>
									</div>
									<div class="grid shrink-0 auto-rows-max grid-cols-3 gap-2 self-center">
										<form class="group" action="/blueprint/view">
											<input name="identifier" type="hidden" value={bookmark.identifier} required />
											{#if bookmark.meta.name}
												<input name="name" type="hidden" value={bookmark.meta.name} required />
											{/if}
											<button class="button primary icon-only" title="View blueprint" type="submit">
												<span class="sr-only">View</span>
												<VisibilityIcon />
											</button>
										</form>
										<button
											class="button primary icon-only"
											title="Edit blueprint"
											on:click={() => onEdit(bookmark)}
										>
											<span class="sr-only">Edit</span>
											<EditIcon />
										</button>
										<button
											class="button danger icon-only"
											title="Delete blueprint"
											on:click={() => onDelete(bookmark)}
										>
											<span class="sr-only">Delete</span>
											<DeleteIcon />
										</button>
										<form class="group" action="/blueprint/download">
											<input name="identifier" type="hidden" value={bookmark.identifier} required />
											{#if bookmark.meta.name}
												<input name="name" type="hidden" value={bookmark.meta.name} required />
											{/if}
											<button
												class="button secondary icon-only"
												title="Download blueprint"
												type="submit"
											>
												<span class="sr-only">Download</span>
												<DownloadIcon />
											</button>
										</form>
										<button
											class="button secondary icon-only"
											title="Copy blueprint"
											use:copy={{ value: bookmark.identifier }}
										>
											<span class="sr-only">Copy</span>
											<CopyIcon />
										</button>
										<button
											class="button secondary icon-only"
											title="Share blueprint"
											use:share={{ href: url }}
										>
											<span class="sr-only">Share</span>
											<ShareFilledIcon />
										</button>
									</div>
								</article>
							</li>
						{/each}
					</ol>
				{:else}
					<div class="flex items-center justify-center">
						<span>No blueprints</span>
					</div>
				{/if}
			{/await}
		{/await}
	{/key}

	<Dialog
		open={!!toEditBookmark}
		on:confirm={async (event) => {
			const formData = event.detail;
			if (!formData) return;

			try {
				const data = Object.fromEntries(formData);
				const validation = BLUEPRINT_FORM_SCHEMA.parse(data);
				const tags = new Set(
					validation.tags
						.trim()
						.replace(/\s+/, ' ')
						.split(' ')
						.map((tag) => tag.replace(/#+/, ''))
				);
				await updateBookmark(validation.name, tags);
			} catch (err) {
				throw new Error('Invalid blueprint data - edit');
			} finally {
				toEditBookmark = undefined;
			}
		}}
		on:cancel={() => (toEditBookmark = undefined)}
	>
		<h2 class="mb-6 text-4xl font-bold">Edit</h2>
		<p>What name should the blueprint have?</p>
		<label class="mt-2 block" for="blueprint-name">
			<span class="sr-only">Blueprint name</span>
			<input
				class="w-full rounded-lg bg-stone-200 p-3 text-neutral-800 outline-none transition placeholder:select-none placeholder:text-stone-400 placeholder:transition hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:placeholder:text-stone-600"
				id="blueprint-name"
				name="name"
				type="text"
				placeholder="Name..."
				value={toEditBookmark?.meta.name ?? ''}
				required
			/>
		</label>
		<label class="mt-2 block" for="blueprint-tags">
			<span class="sr-only">Blueprint tags</span>
			<input
				class="w-full rounded-lg bg-stone-200 p-3 text-neutral-800 outline-none transition placeholder:select-none placeholder:text-stone-400 placeholder:transition hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:placeholder:text-stone-600"
				id="blueprint-tags"
				name="tags"
				type="text"
				placeholder="#tag..."
				value={`${Array.from(toEditBookmark?.meta.tags ?? [])
					.map((tag) => `#${tag}`)
					.join(' ')}`}
				pattern={BLUEPRINT_TAGS_REGEX.source}
			/>
		</label>
	</Dialog>

	<Dialog
		open={!!toDeleteBookmark}
		on:confirm={() => deleteBookmark()}
		on:cancel={() => (toDeleteBookmark = undefined)}
	>
		<h2 class="mb-6 text-4xl font-bold">Delete</h2>
		<p>
			Do you want to delete the blueprint "{toDeleteBookmark?.meta.name ?? BLUEPRINT_DEFAULT_NAME}"?
		</p>
	</Dialog>
</section>
