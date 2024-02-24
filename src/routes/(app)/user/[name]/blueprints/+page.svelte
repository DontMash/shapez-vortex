<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { share } from '$lib/client/actions/share';

	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkIcon.svelte';

	export let data: PageData;

	const deleteModals: Array<HTMLDialogElement> = [];
	const bookmarkModals: Array<HTMLDialogElement> = [];
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
			{#each data.blueprints as blueprint, index}
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

								<div class="flex items-center space-x-1">
									<button
										class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5"
										use:share
									>
										<ShareFilledIcon />
									</button>
									{#if data.user && data.user.id !== blueprint.creator}
										<button
											class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5"
											on:click={() => bookmarkModals[index].showModal()}
										>
											<BookmarkFilledIcon />
										</button>
									{:else}
										<button
											class="btn btn-square btn-error btn-sm fill-neutral-content p-0.5"
											on:click={() => deleteModals[index].showModal()}
										>
											<DeleteIcon />
										</button>
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

						<dialog class="modal backdrop-blur" bind:this={deleteModals[index]}>
							<div class="modal-box">
								<form method="dialog">
									<button class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2 p-1">
										<CloseIcon />
										<span class="sr-only">Close</span>
									</button>
								</form>

								<h4 class="mb-16 text-3xl font-bold">
									Do you want to delete <br />
									{blueprint.title}?
								</h4>
								<div class="flex items-center justify-end space-x-2">
									<form
										class="inline"
										action="/blueprint/{blueprint.id}?/deleteBlueprint"
										method="post"
										use:enhance
										on:submit={() => deleteModals[index].close()}
									>
										<button class="btn btn-error">
											<span class="inline-block h-6 w-6">
												<DeleteIcon />
											</span>
											Delete
										</button>
									</form>
									<form method="dialog">
										<button class="btn btn-neutral">
											<span class="inline-block h-6 w-6">
												<CloseIcon />
											</span>
											Close
										</button>
									</form>
								</div>
							</div>
							<form class="modal-backdrop" method="dialog">
								<button>Close</button>
							</form>
						</dialog>

						<dialog class="modal backdrop-blur" bind:this={bookmarkModals[index]}>
							<div class="modal-box">
								<form method="dialog">
									<button class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2 p-1">
										<CloseIcon />
										<span class="sr-only">Close</span>
									</button>
								</form>

								<h4 class="mb-16 text-3xl font-bold">
									Do you want to remove your bookmark of <br />
									{blueprint.title}?
								</h4>
								<div class="flex items-center justify-end space-x-2">
									<form
										class="inline"
										action="/blueprint/{blueprint.id}?/updateBookmark"
										method="post"
										use:enhance
										on:submit={() => bookmarkModals[index].close()}
									>
										<button class="btn btn-primary">
											<span class="inline-block h-6 w-6">
												<BookmarkIcon />
											</span>
											Remove
										</button>
									</form>
									<form method="dialog">
										<button class="btn btn-neutral">
											<span class="inline-block h-6 w-6">
												<CloseIcon />
											</span>
											Close
										</button>
									</form>
								</div>
							</div>
							<form class="modal-backdrop" method="dialog">
								<button>Close</button>
							</form>
						</dialog>
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
