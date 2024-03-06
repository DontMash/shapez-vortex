<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BlueprintData } from '$lib/blueprint.types';
	import { share } from '$lib/client/actions/share';

	import Dialog from '$lib/components/Dialog.svelte';
	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';

	export let data: Partial<BlueprintData>;
	export let image: string;
	export let url: string;
	export let isEditable: boolean = false;

	let deleteDialog: Dialog;
	let bookmarkDialog: Dialog;
</script>

<article
	class="grid grid-cols-3 divide-x divide-base-content divide-opacity-20 overflow-hidden rounded-box border border-base-content border-opacity-20 bg-base-200 shadow-lg"
>
	<a class="" href="/blueprint/{data.id}">
		<figure class="aspect-h-2 aspect-w-3">
			{#if image}
				<img class="object-cover" src={image} alt="Preview of {data.title}" />
			{:else}
				<img
					class="object-contain p-8"
					src="/favicon.png"
					alt="Preview placeholder for {data.title}"
				/>
			{/if}
		</figure>
	</a>

	<div class="col-span-2 space-y-2 p-4">
		<div class="flex items-center space-x-2">
			<a class="link-hover link transition-colors hover:text-primary" href="/blueprint/{data.id}">
				<h3 class="text-3xl font-bold">
					{data.title}
				</h3>
			</a>

			{#if data.expand && data.expand['creator']}
				<span class="badge badge-accent text-xs">
					@{data.expand['creator'].displayname}
				</span>
			{/if}

			<div class="!ml-auto flex items-center space-x-1">
				<button
					class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5"
					use:share={{ href: url }}
				>
					<ShareFilledIcon />
				</button>
				{#if isEditable}
					<button
						class="btn btn-square btn-error btn-sm fill-neutral-content p-0.5"
						on:click={() => deleteDialog.show()}
					>
						<DeleteIcon />
					</button>
				{:else}
					<button
						class="btn btn-square btn-ghost btn-sm fill-neutral-content p-0.5"
						on:click={() => bookmarkDialog.show()}
					>
						<BookmarkFilledIcon />
					</button>
				{/if}
			</div>
		</div>

		{#if data.expand && data.expand['tags']}
			<ul>
				{#each data.expand['tags'] as tag}
					<li class="inline">
						<span class="badge badge-primary badge-outline">
							#{tag.name}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if isEditable}
		<Dialog bind:this={deleteDialog}>
			<div class="p-6">
				<h4 class="mb-16 text-3xl font-bold">
					Do you want to delete <br />
					{data.title}?
				</h4>
				<div class="flex items-center justify-end space-x-2">
					<form
						class="inline"
						action="/blueprint/{data.id}?/deleteBlueprint"
						method="post"
						use:enhance
						on:submit={() => deleteDialog.close()}
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
							Cancel
						</button>
					</form>
				</div>
			</div>
		</Dialog>
	{:else}
		<Dialog bind:this={bookmarkDialog}>
			<div class="p-6">
				<h4 class="mb-16 text-3xl font-bold">
					Do you want to remove your bookmark of <br />
					{data.title}?
				</h4>
				<div class="flex items-center justify-end space-x-2">
					<form
						class="inline"
						action="/blueprint/{data.id}?/updateBookmark"
						method="post"
						use:enhance
						on:submit={() => bookmarkDialog.close()}
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
							Cancel
						</button>
					</form>
				</div>
			</div>
		</Dialog>
	{/if}
</article>
