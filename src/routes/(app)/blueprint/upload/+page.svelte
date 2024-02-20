<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import {
		BLUEPRINT_IDENTIFIER_REGEX,
		BLUEPRINT_IMAGES_MAX,
		BLUEPRINT_TAGS_REGEX,
		BLUEPRINT_TITLE_MAX_LENGTH,
		BLUEPRINT_TITLE_MIN_LENGTH,
		BLUEPRINT_TITLE_REGEX
	} from '$lib/blueprint.types';

	import ChevronLeftIcon from '$lib/components/icons/ChevronLeftIcon.svelte';
	import ChevronRightIcon from '$lib/components/icons/ChevronRightIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import UploadIcon from '$lib/components/icons/UploadIcon.svelte';

	export let data: PageData;

	let imagesFileinputElement: HTMLInputElement;
	let previewImages: Array<File> = [];

	function onPreviewImageFileChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement || !inputElement.files) return;

		const list = new DataTransfer();
		const files = Array.from(inputElement.files).slice(0, BLUEPRINT_IMAGES_MAX);
		files.forEach((file) => {
			list.items.add(file);
		});
		inputElement.files = list.files;

		updatePreviewImages(inputElement);
	}
	function updatePreviewImages(input: HTMLInputElement) {
		if (!input.files) return;

		previewImages = Array.from(input.files);
	}
	function updateFileinputImages(input: HTMLInputElement) {
		const list = new DataTransfer();
		previewImages.forEach((image) => {
			list.items.add(image);
		});
		input.files = list.files;

		updatePreviewImages(imagesFileinputElement);
	}
	function onRemoveImage(index: number) {
		if (!imagesFileinputElement) return;

		previewImages = previewImages.filter((_, imageIndex) => imageIndex !== index);

		updateFileinputImages(imagesFileinputElement);
	}
	function swapImage(from: number, to: number) {
		const tmp = previewImages[to];
		previewImages[to] = previewImages[from];
		previewImages[from] = tmp;

		updateFileinputImages(imagesFileinputElement);
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6">
					<UploadIcon />
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

	<form method="post" enctype="multipart/form-data">
		<label class="form-control" for="title">
			<div class="label">
				<span class="label-text">Title</span>
			</div>
			{#if $page.form && $page.form.invalid}
				<input
					class={`input input-bordered text-sm placeholder:italic ${
						$page.form.issues['title'] ? 'input-error' : ''
					}`}
					type="text"
					name="title"
					id="title"
					value={$page.form.data.title}
					placeholder="My blueprint ..."
					minlength={BLUEPRINT_TITLE_MIN_LENGTH}
					maxlength={BLUEPRINT_TITLE_MAX_LENGTH}
					pattern={BLUEPRINT_TITLE_REGEX.source}
					required
				/>
				{#if $page.form.issues['title']}
					<div class="label">
						<span class="label-text-alt italic text-error">{$page.form.issues['title']}</span>
					</div>
				{/if}
			{:else}
				<input
					class="input input-bordered text-sm placeholder:italic"
					type="text"
					name="title"
					id="title"
					placeholder="My blueprint ..."
					minlength={BLUEPRINT_TITLE_MIN_LENGTH}
					maxlength={BLUEPRINT_TITLE_MAX_LENGTH}
					pattern={BLUEPRINT_TITLE_REGEX.source}
					required
				/>
			{/if}
		</label>

		<label class="form-control" for="data">
			<div class="label">
				<span class="label-text">Blueprint identifier</span>
			</div>
			{#if $page.form && $page.form.invalid}
				<input
					class={`input input-bordered text-sm placeholder:italic ${
						$page.form.issues['data'] ? 'input-error' : ''
					}`}
					type="text"
					name="data"
					id="data"
					value={$page.form.data.data}
					placeholder="SHAPEZ-2 ... $"
					pattern={BLUEPRINT_IDENTIFIER_REGEX.source}
					required
				/>
				{#if $page.form.issues['data']}
					<div class="label">
						<span class="label-text-alt italic text-error">{$page.form.issues['data']}</span>
					</div>
				{/if}
			{:else}
				<input
					class="input input-bordered text-sm placeholder:italic"
					type="text"
					name="data"
					id="data"
					placeholder="SHAPEZ-2 ... $"
					pattern={BLUEPRINT_IDENTIFIER_REGEX.source}
					required
				/>
			{/if}
		</label>

		<details class="collapse collapse-arrow mt-4 rounded-btn bg-base-200">
			<summary class="collapse-title !flex cursor-pointer items-center text-sm">
				Additional information
			</summary>
			<div class="collapse-content">
				<label class="form-control" for="tags">
					<div class="label">
						<span class="label-text">
							Tags <span class="text-xs text-base-300">(optional)</span>
						</span>
						<i class="label-text-alt">comma seperated list</i>
					</div>
					{#if $page.form && $page.form.invalid}
						<input
							class={`input input-bordered text-sm placeholder:italic ${
								$page.form.issues['tags'] ? 'input-error' : ''
							}`}
							type="text"
							name="tags"
							id="tags"
							value={$page.form.data.tags}
							placeholder="efficient, compact, ..."
							pattern={BLUEPRINT_TAGS_REGEX.source}
						/>
						{#if $page.form.issues['tags']}
							<div class="label">
								<span class="label-text-alt italic text-error">{$page.form.issues['tags']}</span>
							</div>
						{/if}
					{:else}
						<input
							class="input input-bordered text-sm placeholder:italic"
							type="text"
							name="tags"
							id="tags"
							placeholder="efficient, compact, ..."
							pattern={BLUEPRINT_TAGS_REGEX.source}
						/>
					{/if}
				</label>

				<label class="form-control h-64" for="description">
					<div class="label">
						<span class="label-text">
							Description <span class="text-xs text-base-300">(optional)</span>
						</span>
						<i class="label-text-alt">max. 2048 characters</i>
					</div>
					{#if $page.form && $page.form.invalid}
						<textarea
							class={`textarea textarea-bordered h-full resize-none placeholder:italic ${
								$page.form.issues['description'] ? 'textarea-error' : ''
							}`}
							name="description"
							id="description"
							value={$page.form.data.description}
							placeholder="Reimagine shape processing ..."
						/>
						{#if $page.form.issues['description']}
							<div class="label">
								<span class="label-text-alt italic text-error"
									>{$page.form.issues['description']}</span
								>
							</div>
						{/if}
					{:else}
						<textarea
							class="textarea textarea-bordered h-full resize-none placeholder:italic"
							name="description"
							id="description"
							placeholder="Reimagine shape processing ..."
						/>
					{/if}
				</label>

				<label class="form-control" for="images">
					<div class="label">
						<span class="label-text">
							Images <span class="text-xs text-base-300">(optional)</span>
						</span>
						<i class="label-text-alt">max. 8 images</i>
					</div>
					{#if $page.form && $page.form.invalid}
						<input
							class={`file-input file-input-bordered text-sm placeholder:italic ${
								$page.form.issues['images'] ? 'file-input-error' : ''
							}`}
							type="file"
							name="images"
							id="images"
							multiple
							accept="image/png,image/jpeg,image/gif"
							bind:this={imagesFileinputElement}
							on:change={onPreviewImageFileChange}
						/>
						<div class="label">
							<span class="label-text-alt italic text-error">{$page.form.issues['images']}</span>
						</div>
					{:else}
						<input
							class="file-input file-input-bordered text-sm placeholder:italic"
							type="file"
							name="images"
							id="images"
							multiple
							accept="image/png,image/jpeg,image/gif"
							bind:this={imagesFileinputElement}
							on:change={onPreviewImageFileChange}
						/>
					{/if}
				</label>
				{#if previewImages.length > 0}
					<ol class="mt-4 grid auto-rows-auto grid-cols-3 gap-4">
						{#each previewImages as previewImage, index}
							<li class="group relative">
								<figure class="aspect-h-2 aspect-w-3">
									<img
										class="rounded-btn border border-base-content border-opacity-20 object-cover shadow-lg"
										src={URL.createObjectURL(previewImage)}
										alt={`Preview image ${index} - ${previewImage.name}`}
									/>
								</figure>

								<span class="badge badge-secondary badge-lg absolute left-4 top-4 font-bold">
									{index < 1 ? 'Preview' : `#${index}`}
								</span>
								<span
									class={`absolute bottom-4 right-4 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 ${
										previewImages.length > 1 ? 'join border border-base-300' : ''
									}`}
								>
									{#if index > 0}
										<button
											class="btn btn-square btn-accent join-item btn-sm fill-accent-content p-1"
											title="Move to previous position"
											type="button"
											on:click={() => swapImage(index, index - 1)}
										>
											<ChevronLeftIcon />
											<span class="sr-only">Move to previous position</span>
										</button>
									{/if}
									{#if index < previewImages.length - 1}
										<button
											class="btn btn-square btn-accent join-item btn-sm fill-accent-content p-1"
											title="Move to next position"
											type="button"
											on:click={() => swapImage(index, index + 1)}
										>
											<ChevronRightIcon />
											<span class="sr-only">Move to next position</span>
										</button>
									{/if}
									<button
										class="btn btn-square btn-error join-item btn-sm fill-error-content p-1"
										title="Remove image"
										type="button"
										on:click={() => onRemoveImage(index)}
									>
										<CloseIcon />
										<span class="sr-only">Remove image</span>
									</button>
								</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</details>

		<button class="btn btn-primary btn-block mt-4">Upload</button>
	</form>
</section>
