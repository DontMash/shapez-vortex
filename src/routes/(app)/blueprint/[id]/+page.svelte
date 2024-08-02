<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { copy } from '$lib/client/actions/clipboard';
	import { add } from '$lib/client/toast/toast.service';
	import { REPORT_REASONS } from '$lib/report.types';

	import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
	import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';
	import UserTag from '$lib/components/UserTag.svelte';
	import BookmarkIcon from '$lib/components/icons/BookmarkIcon.svelte';
	import BookmarkFilledIcon from '$lib/components/icons/BookmarkFilledIcon.svelte';
	import ChevronLeftIcon from '$lib/components/icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import CurrencyBitcoinIcon from '$lib/components/icons/CurrencyBitcoinIcon.svelte';
	import DashboardCustomizeFilledIcon from '$lib/components/icons/DashboardCustomizeFilledIcon.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import DomainIcon from '$lib/components/icons/DomainIcon.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';
	import FlagIcon from '$lib/components/icons/FlagIcon.svelte';
	import InfoIcon from '$lib/components/icons/InfoIcon.svelte';
	import OpenInNewIcon from '$lib/components/icons/OpenInNewIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';
	import TitleIcon from '$lib/components/icons/TitleIcon.svelte';
	import UpdateIcon from '$lib/components/icons/UpdateIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';

	export let data: PageData;

	const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
	const imageModals: Array<Dialog> = [];
	let reportModal: Dialog;

	function onBookmark(event: Event) {
		const form = event.target as HTMLFormElement;
		form.submit();
		invalidate('update:blueprint');
	}
</script>

<section class="mx-auto w-full max-w-5xl space-y-16">
	<article
		class="grid grid-cols-3 overflow-hidden rounded-box border border-base-content border-opacity-20 shadow-lg"
	>
		<aside
			class="flex flex-col divide-y divide-base-content divide-opacity-20 border-r border-base-content border-opacity-20 bg-base-200"
		>
			{#if data.blueprint.images.length > 0}
				{@const images = data.blueprint.images}
				<div class="group relative">
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
									class="btn btn-circle btn-neutral btn-sm absolute right-2 top-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
									on:click={() => imageModals[index].show()}
								>
									<span class="inline-block h-6 w-6">
										<OpenInNewIcon />
										<span class="sr-only">Open detail view</span>
									</span>
								</button>
								{#if images.length > 1}
									<div
										class="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
									>
										<a
											class="btn btn-circle btn-neutral btn-sm fill-neutral-content"
											href={previousId}
										>
											<ChevronLeftIcon />
											<span class="sr-only">Previous</span>
										</a>
										<a class="btn btn-circle btn-neutral btn-sm fill-neutral-content" href={nextId}>
											<ChevronRightIcon />
											<span class="sr-only">Next</span>
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
							class="badge badge-neutral badge-sm absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
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

			<div class="grow space-y-2 p-4">
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6 fill-primary">
						<TitleIcon />
					</span>
					<span>
						<span class="font-medium">
							{data.blueprint.entry.type}
						</span>
						<span class="text-sm text-base-300">type</span>
					</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6 fill-secondary">
						<CurrencyBitcoinIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.cost}</span>
						<span class="text-sm text-base-300">points</span>
					</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6">
						<DomainIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.buildingCount}</span>
						<span class="text-sm text-base-300">
							{data.blueprint.entry.buildingCount > 1 ? 'buildings' : 'building'}
						</span>
					</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6">
						<DashboardCustomizeFilledIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.islandCount || '-'}</span>
						<span class="text-sm text-base-300">
							{data.blueprint.entry.islandCount > 1 ? 'islands' : 'island'}
						</span>
					</span>
				</div>
				<div class="flex items-center space-x-4 pt-4">
					<span class="inline-block h-6 w-6">
						<VisibilityIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.viewCount || '-'}</span>
						<span class="text-sm text-base-300">
							{data.blueprint.entry.viewCount > 1 ? 'views' : 'view'}
						</span>
					</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6">
						<DownloadIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.downloadCount || '-'}</span>
						<span class="text-sm text-base-300">
							{data.blueprint.entry.downloadCount > 1 ? 'downloads' : 'download'}
						</span>
					</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="inline-block h-6 w-6">
						<BookmarkFilledIcon />
					</span>
					<span>
						<span class="font-medium">{data.blueprint.entry.bookmarkCount || '-'}</span>
						<span class="text-sm text-base-300">
							{data.blueprint.entry.bookmarkCount > 1 ? 'bookmarks' : 'bookmark'}
						</span>
					</span>
				</div>
			</div>
		</aside>

		<div class="col-span-2 flex flex-col space-y-4 px-8 py-4">
			<header class="space-y-2 border-b border-base-content border-opacity-20 pb-4">
				<div class="flex items-center justify-between">
					{#if data.blueprint.entry.expand && data.blueprint.entry.expand['creator']}
						<UserTag name={data.blueprint.entry.expand['creator'].displayname} />
					{/if}
					<div class="flex space-x-1">
						<span class="badge badge-neutral text-xs">
							<span class="mr-0.5 inline h-4 w-4">
								<InfoIcon />
							</span>
							v{data.blueprint.entry.version}
						</span>
						<span class="badge badge-neutral text-xs">
							<span class="mr-0.5 inline h-4 w-4">
								<UpdateIcon />
							</span>
							<span class="sr-only">updated on</span>
							{dateFormatter.format(new Date(data.blueprint.entry.updated))}
						</span>
						<span class="badge badge-neutral text-xs">
							<span class="mr-0.5 inline h-4 w-4">
								<EditIcon />
							</span>
							<span class="sr-only">created on</span>
							{dateFormatter.format(new Date(data.blueprint.entry.created))}
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
								class="btn btn-square btn-ghost btn-sm p-0.5"
								on:click={() => reportModal.show()}
							>
								<FlagIcon />
							</button>
						{/if}
						<button
							class="btn btn-square btn-ghost btn-sm p-0.5"
							use:copy={{ value: window.location.href }}
						>
							<ShareFilledIcon />
						</button>
						{#if data.user}
							{#if data.user.id !== data.blueprint.entry.creator}
								<form
									class="inline-flex"
									action="?/updateBookmark"
									method="post"
									on:submit|preventDefault={onBookmark}
								>
									<button class="btn btn-square btn-ghost btn-sm p-0.5">
										{#if data.blueprint.isBookmarked}
											<BookmarkFilledIcon />
										{:else}
											<BookmarkIcon />
										{/if}
									</button>
								</form>
							{:else}
								<a
									class="btn btn-square btn-secondary btn-sm fill-secondary-content p-0.5"
									href={`/blueprint/${data.blueprint.entry.id}/edit`}
								>
									<EditIcon />
								</a>
							{/if}
						{/if}

						<Dialog bind:this={reportModal}>
							<div class="p-6">
								<h3 class="mb-4 text-xl font-bold">
									Report “{data.blueprint.entry.title}”
								</h3>
								<form class="space-y-2" action="?/reportBlueprint" method="post">
									<input type="hidden" name="entry" value={data.blueprint.entry.id} />

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
										<button class="btn btn-error">
											<span class="inline-block size-6">
												<FlagIcon />
											</span>
											Report
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

			<div class="prose grow">{@html data.blueprint.entry.description}</div>

			<div class="flex items-center justify-end space-x-2">
				<a class="btn btn-primary" href={`/blueprint/${data.blueprint.entry.id}/view`}>
					<span class="inline-block h-6 w-6 fill-primary-content">
						<VisibilityIcon />
					</span>
					View
				</a>
				<a
					class="btn btn-secondary"
					href={`/blueprint/${data.blueprint.entry.id}/download`}
					download
				>
					<span class="inline-block h-6 w-6 fill-secondary-content">
						<DownloadIcon />
					</span>
					Download
				</a>
				<button
					class="btn btn-accent"
					use:copy={{ value: JSON.stringify(data.blueprint.entry.data, null, 4) }}
					on:copy={() => add({ message: 'Content copied' })}
					on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
				>
					<span class="inline-block h-6 w-6 fill-secondary-content">
						<CopyIcon />
					</span>
					Copy
				</button>
			</div>
		</div>
	</article>

	<BlueprintView
		identifier={data.blueprint.entry.data}
		blueprint={data.blueprint.data}
		title={data.blueprint.entry.title}
		controls={{ zoom: false }}
	/>
</section>
