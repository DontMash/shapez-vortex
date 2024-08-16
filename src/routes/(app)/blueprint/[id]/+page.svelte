<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { copy } from '$lib/client/actions/clipboard';
	import { add } from '$lib/client/toast.service';
	import { REPORT_REASONS } from '$lib/report.types';
	import type { PageData } from './$types';

	import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
	import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import UserTag from '$lib/components/UserTag.svelte';

	export let data: PageData;

	const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
	const imageModals: Array<Dialog> = [];
	let reportDialog: Dialog;
	let deleteDialog: Dialog;

	function onBookmark(event: Event) {
		const form = event.target as HTMLFormElement;
		form.submit();
		invalidate('update:blueprint');
	}
</script>

<article
	class="mx-auto grid w-full max-w-5xl grid-cols-1 divide-y divide-base-content/20 overflow-hidden border-y border-base-content/20 shadow-lg transition-[border-radius] md:grid-cols-3 md:divide-x md:divide-y-0 lg:rounded-box lg:border"
>
	<div class="flex flex-col space-y-4 p-4 md:col-span-2">
		<header class="space-y-2 border-b border-base-content/20 pb-4">
			<div class="flex flex-col-reverse justify-between gap-y-2 md:flex-row md:items-center">
				{#if data.blueprint.entry.expand && data.blueprint.entry.expand['creator']}
					<UserTag name={data.blueprint.entry.expand['creator'].displayname} />
				{/if}
				<div class="flex space-x-1">
					<span class="badge badge-neutral space-x-1">
						<span class="icon-[tabler--info-circle]">Game version</span>
						<span class="text-xs">
							v{data.blueprint.entry.version}
						</span>
					</span>
					<span class="badge badge-neutral space-x-1">
						<span class="icon-[tabler--clock-edit]">Created on</span>
						<span class="text-xs">
							{dateFormatter.format(new Date(data.blueprint.entry.created))}
						</span>
					</span>
				</div>
			</div>

			<div class="flex items-end justify-between">
				<h2 class="text-3xl font-bold">
					{data.blueprint.entry.title}
				</h2>
				<div>
					{#if data.user && data.user.verified && data.user.id !== data.blueprint.entry.creator}
						<button
							class="btn btn-square btn-ghost btn-sm"
							title="Report blueprint"
							on:click={() => reportDialog.show()}
						>
							<span class="icon-[tabler--flag] text-2xl">Report</span>
						</button>

						<Dialog bind:this={reportDialog}>
							<div class="p-6">
								<h2 class="mb-4 text-xl font-bold">
									Report “{data.blueprint.entry.title}”
								</h2>
								<form class="space-y-2" action="?/reportBlueprint" method="post">
									<input type="hidden" name="blueprint" value={data.blueprint.entry.id} />

									<label class="form-control" for="reason">
										<div class="label">
											<span class="label-text">Reason</span>
										</div>
										<select class="select select-bordered" name="reason" id="reason" required>
											{#each REPORT_REASONS as reason}
												<option
													selected={$page.form &&
														$page.form.invalid &&
														$page.form.issues['reason'] &&
														$page.form.data['reason'] === reason}
													value={reason}
												>
													{reason}
												</option>
											{/each}
										</select>
									</label>

									<label class="form-control h-64" for="message">
										<div class="label">
											<span class="label-text">Message</span>
											<i class="label-text-alt">max. 256 characters</i>
										</div>
										{#if $page.form && $page.form.invalid}
											<textarea
												class={`textarea textarea-bordered h-full resize-none placeholder:italic ${
													$page.form.issues['message'] ? 'textarea-error' : ''
												}`}
												name="message"
												id="message"
												value={$page.form.data['message']}
												placeholder="This entry contains ..."
												required
												maxlength="256"
											/>
											{#if $page.form.issues['message']}
												<div class="label">
													<span class="label-text-alt italic text-error">
														{$page.form.issues['message']}
													</span>
												</div>
											{/if}
										{:else}
											<textarea
												class="textarea textarea-bordered h-full resize-none placeholder:italic"
												name="message"
												id="message"
												placeholder="This entry contains ..."
												required
												maxlength="256"
											/>
										{/if}
									</label>

									<div class="flex items-center justify-end space-x-2 pt-4">
										<button class="btn btn-error" title="Report blueprint">
											<span class="icon-[tabler--flag] text-2xl" />
											Report
										</button>
										<form method="dialog">
											<button class="btn btn-neutral">
												<span class="2xl icon-[tabler--x] text-2xl" />
												Cancel
											</button>
										</form>
									</div>
								</form>
							</div>
						</Dialog>
					{/if}
					<button
						class="btn btn-square btn-ghost btn-sm"
						title="Share blueprint"
						use:copy={{ value: window.location.href }}
					>
						<span class="icon-[tabler--share] text-2xl">Share</span>
					</button>
					{#if data.user}
						{#if data.user.id !== data.blueprint.entry.creator}
							<form
								class="inline-flex"
								action="?/updateBookmark"
								method="post"
								on:submit|preventDefault={onBookmark}
							>
								<button
									class="btn btn-square btn-ghost btn-sm"
									title="{data.blueprint.isBookmarked ? 'Unbookmark' : 'Bookmark'} blueprint"
								>
									{#if data.blueprint.isBookmarked}
										<span class="icon-[tabler--bookmark-filled] text-2xl">Bookmark</span>
									{:else}
										<span class="icon-[tabler--bookmark] text-2xl">Bookmark</span>
									{/if}
								</button>
							</form>
						{:else}
							<a
								class="btn btn-square btn-secondary btn-sm text-secondary-content"
								title="Edit blueprint"
								href={`/blueprint/${data.blueprint.entry.id}/edit`}
							>
								<span class="icon-[tabler--edit] text-2xl">Edit</span>
							</a>
							<button class="btn btn-square btn-error btn-sm" on:click={() => deleteDialog.show()}>
								<span class="icon-[tabler--trash] text-2xl" />
							</button>

							<Dialog bind:this={deleteDialog}>
								<div class="p-6">
									<h4 class="mb-16 text-3xl font-bold">
										Do you want to delete <br />
										{data.blueprint.entry.title}?
									</h4>
									<div class="flex items-center justify-end space-x-2">
										<form
											class="inline"
											action="/api/v1/blueprint"
											method="post"
											on:submit|preventDefault={async (event) => {
												deleteDialog.close();

												const url = new URL(event.currentTarget.action, $page.url.origin);
												const formData = new FormData(event.currentTarget);
												try {
													const response = await fetch(url, { method: 'delete', body: formData });
													if (!response.ok) {
														return add({ message: 'Failed to delete blueprint', type: 'ERROR' });
													}

													add({ message: 'Successfully deleted blueprint', type: 'SUCCESS' });
													goto('/blueprint/search');
												} catch (_) {
													add({ message: 'Error while deleting blueprint', type: 'ERROR' });
												}
											}}
										>
											<input type="hidden" name="id" value={data.blueprint.entry.id} />
											<button class="btn btn-error">
												<span class="icon-[tabler--trash] text-2xl" />
												Delete
											</button>
										</form>
										<form method="dialog">
											<button class="btn btn-neutral">
												<span class="icon-[tabler--x] text-2xl" />
												Cancel
											</button>
										</form>
									</div>
								</div>
							</Dialog>
						{/if}
					{/if}
				</div>
			</div>
		</header>

		{#if data.blueprint.entry.expand && data.blueprint.entry.expand['tags']}
			{@const tags = data.blueprint.entry.expand['tags']}
			<ul>
				{#each tags as tag}
					<li class="inline">
						<BlueprintTag data={tag} />
					</li>
				{/each}
			</ul>
		{/if}

		<div class="prose min-h-32 grow">{@html data.blueprint.entry.description}</div>

		<div class="flex flex-col gap-2 sm:flex-row">
			<a
				class="btn btn-primary"
				title="View blueprint"
				href={`/blueprint/${data.blueprint.entry.id}/view`}
			>
				<span class="icon-[tabler--eye] text-2xl" />
				View
			</a>
			<a
				class="btn btn-secondary"
				title="Download blueprint"
				href={`/blueprint/${data.blueprint.entry.id}/download`}
				download
			>
				<span class="icon-[tabler--download] text-2xl" />
				Download
			</a>
			<button
				class="btn btn-accent"
				title="Copy blueprint"
				use:copy={{ value: data.blueprint.entry.data }}
				on:copy={() => add({ message: 'Content copied' })}
				on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
			>
				<span class="icon-[tabler--copy] text-2xl" />
				Copy
			</button>
		</div>
	</div>

	<aside
		class="flex flex-col divide-y divide-base-content/20 bg-base-200 md:flex-col-reverse md:divide-y-reverse"
	>
		<div
			class="grid grow grid-flow-col grid-cols-2 grid-rows-4 gap-2 p-4 md:grid-flow-row md:grid-cols-1 md:grid-rows-none"
		>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--square-rounded-letter-t] text-2xl text-primary">
					Blueprint Type
				</span>
				<span>
					<span class="font-medium">
						{data.blueprint.entry.type}
					</span>
					<span class="text-sm text-base-300">type</span>
				</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--currency-bitcoin] text-2xl text-secondary">Blueprint cost</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.cost}</span>
					<span class="text-sm text-base-300">points</span>
				</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--schema] text-2xl">Building count</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.buildingCount}</span>
					<span class="text-sm text-base-300">
						{data.blueprint.entry.buildingCount > 1 ? 'buildings' : 'building'}
					</span>
				</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--apps] text-2xl">Island count</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.islandCount || '-'}</span>
					<span class="text-sm text-base-300">
						{data.blueprint.entry.islandCount > 1 ? 'islands' : 'island'}
					</span>
				</span>
			</div>
			<div class="flex items-center space-x-4 md:mt-4">
				<span class="icon-[tabler--eye] text-2xl">View count</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.viewCount || '-'}</span>
					<span class="text-sm text-base-300">
						{data.blueprint.entry.viewCount > 1 ? 'views' : 'view'}
					</span>
				</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--download] text-2xl">Download count</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.downloadCount || '-'}</span>
					<span class="text-sm text-base-300">
						{data.blueprint.entry.downloadCount > 1 ? 'downloads' : 'download'}
					</span>
				</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="icon-[tabler--bookmark-filled] text-2xl">Bookmark count</span>
				<span>
					<span class="font-medium">{data.blueprint.entry.bookmarkCount || '-'}</span>
					<span class="text-sm text-base-300">
						{data.blueprint.entry.bookmarkCount > 1 ? 'bookmarks' : 'bookmark'}
					</span>
				</span>
			</div>
		</div>

		{#if data.blueprint.images.length > 0}
			{@const images = data.blueprint.images}
			<div class="relative">
				<div class="carousel carousel-center flex">
					{#each images as image, index}
						{@const id = `image${index + 1}`}
						{@const name = `Image #${index}`}
						{@const previousId = `#image${((index + images.length - 1) % images.length) + 1}`}
						{@const nextId = `#image${((index + images.length + 1) % images.length) + 1}`}

						<div class="carousel-item relative w-full" {id}>
							<figure class="aspect-h-2 aspect-w-3 w-full">
								<img class="object-fit" src={image.thumbnail} alt={name} />
							</figure>
							<button
								class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2 shadow-md"
								on:click={() => imageModals[index].show()}
							>
								<span class="icon-[tabler--window-maximize] text-lg">Open detail view</span>
							</button>
							{#if images.length > 1}
								<div
									class="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between"
								>
									<a class="btn btn-circle btn-neutral btn-sm shadow-md" href={previousId}>
										<span class="icon-[tabler--chevron-left] text-lg">Previous</span>
									</a>
									<a class="btn btn-circle btn-neutral btn-sm shadow-md" href={nextId}>
										<span class="icon-[tabler--chevron-right] text-lg">Next</span>
									</a>
								</div>
							{/if}
						</div>

						<Dialog width="full" bind:this={imageModals[index]}>
							<figure class="aspect-h-2 aspect-w-3">
								<img class="object-fit" src={image.src} alt={name} />
							</figure>
						</Dialog>
					{/each}
				</div>
				{#if images.length > 1}
					<div
						class="badge badge-neutral badge-sm absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1"
					>
						{#each images as _, index}
							{@const link = `#image${index + 1}`}
							{@const name = `Image #${index}`}
							<a
								class="relative inline-block h-1.5 w-1.5 rounded-full bg-accent outline-accent transition-transform before:absolute before:-inset-0.5 hover:scale-125 focus-visible:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
								href={link}
								title={name}
							>
								<span class="sr-only">{name}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</aside>
</article>

<section class="mx-auto mt-16 w-full max-w-5xl">
	{#if !!!data.agent?.device.type}
		<BlueprintView
			identifier={data.blueprint.entry.data}
			blueprint={data.blueprint.data}
			title={data.blueprint.entry.title}
			controls={{ zoom: false }}
		/>
	{/if}
</section>
