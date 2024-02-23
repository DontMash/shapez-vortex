<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { share } from '$lib/client/actions/share';

	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';

	export let data: PageData;
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-4 pb-4"
	>
		<h2 class="inline-flex flex-grow items-center space-x-2 text-lg font-bold">
			<span class="inline-block h-6 w-6">
				<BookmarkFilledIcon />
			</span>
			<span>
				{data.seo.title}
			</span>
		</h2>
	</header>

	{#if data.blueprints && data.blueprints.length > 0}
		<ol class="space-y-8">
			{#each data.blueprints as blueprint}
				{@const preview = data.images && data.images[blueprint.id]}
				<li>
					<article
						class="grid grid-cols-3 divide-x divide-base-content divide-opacity-20 overflow-hidden rounded-box border border-base-content border-opacity-20 bg-base-200 shadow-lg"
					>
						<a href="/blueprint/{blueprint.id}">
							<figure class="aspect-h-2 aspect-w-3">
								{#if preview}
									<img class="object-cover" src={preview} alt="Preview of {blueprint.title}" />
								{:else}
									<img
										class="object-contain p-8"
										src="/favicon.png"
										alt="Preview placeholder for {blueprint.title}"
									/>
								{/if}
							</figure>
						</a>

						<div class="col-span-2 space-y-2 p-4">
							<div class="flex items-center justify-between">
								<a href="/blueprint/{blueprint.id}">
									<h3 class="text-3xl font-bold">
										{blueprint.title}
									</h3>
								</a>

								<div>
									<button
										class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5"
										use:share
									>
										<ShareFilledIcon />
									</button>
									{#if data.user && data.user.id !== blueprint.creator}
										<form
											class="inline"
											action="/blueprint/{blueprint.id}?/updateBookmark"
											method="post"
											use:enhance
										>
											<button class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5">
												<BookmarkFilledIcon />
											</button>
										</form>
									{:else}
										<form
											class="inline"
											action="/blueprint/{blueprint.id}?/deleteBlueprint"
											method="post"
											use:enhance
										>
											<button class="btn btn-square btn-error btn-sm fill-neutral-content p-0.5">
												<DeleteIcon />
											</button>
										</form>
									{/if}
								</div>
							</div>

							{#if blueprint.expand && blueprint.expand['tags']}
								{@const tags = blueprint.expand['tags']}
								<ul>
									{#each tags as tag}
										<li class="inline">
											<span class="badge badge-primary badge-outline">
												#{tag.name}
											</span>
										</li>
									{/each}
								</ul>
							{/if}
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
</section>
