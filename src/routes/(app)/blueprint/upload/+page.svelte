<script lang="ts">
	import { page } from '$app/stores';
	import { add } from '$lib/client/toast.service';
	import { decode, isBlueprintIdentifier } from '$lib/blueprint';
	import {
		BLUEPRINT_IDENTIFIER_REGEX,
		BLUEPRINT_IMAGES_MAX,
		BLUEPRINT_IMAGE_MAX_FILE_SIZE,
		BLUEPRINT_TAGS_REGEX,
		BLUEPRINT_TITLE_MAX_LENGTH,
		BLUEPRINT_TITLE_MIN_LENGTH,
		BLUEPRINT_TITLE_REGEX,
		type Blueprint,
		type BlueprintIdentifier
	} from '$lib/blueprint.types';
	import type { PageData } from './$types';

	import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

	export let data: PageData;

	let identifier: BlueprintIdentifier;
	let blueprint: Blueprint | undefined;
	$: {
		try {
			blueprint = isBlueprintIdentifier(identifier) ? decode(identifier) : undefined;
		} catch (error) {
			blueprint = undefined;
			add({ message: 'Invalid blueprint identifier', type: 'ERROR' });
		}
	}
	let view: BlueprintView;

	let imagesFileinputElement: HTMLInputElement;
	let previewImages: Array<File> = [];

	const MAX_IMAGES = BLUEPRINT_IMAGES_MAX - 1;
	function onPreviewImageFileChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement || !inputElement.files) return;

		const list = new DataTransfer();
		const files = Array.from([...(imagesFileinputElement.files ?? []), ...inputElement.files]);
		if (files.length > MAX_IMAGES) {
			add({ message: `Max. ${MAX_IMAGES} images allowed.`, type: 'WARNING' });
		}
		const filelist = files.slice(0, MAX_IMAGES).filter((file) => {
			if (file.size > BLUEPRINT_IMAGE_MAX_FILE_SIZE) {
				const maxSizeMb = Math.round(BLUEPRINT_IMAGE_MAX_FILE_SIZE / 1024 / 1024);
				add({
					message: `Size of image is too large (max. ${maxSizeMb}MB) - ${file.name}`,
					type: 'ERROR'
				});
				return false;
			}
			return true;
		});
		filelist.forEach((file) => list.items.add(file));
		inputElement.value = '';
		imagesFileinputElement.files = list.files;

		updatePreviewImages(imagesFileinputElement);
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

		updatePreviewImages(input);
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
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4">
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--upload] align-text-bottom text-2xl" />
				{data.seo.title}
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<form
		class="px-4 lg:px-0"
		method="post"
		enctype="multipart/form-data"
		on:submit|preventDefault={(event) => {
			const canvas = view.canvas();
			if (!canvas) {
				return add({ message: 'Preview canvas unavailable', type: 'ERROR' });
			}

			const form = event.currentTarget;
			canvas.toBlob((blob) => {
				if (!blob) {
					return add({ message: 'Cannot create preview image', type: 'ERROR' });
				}

				const list = new DataTransfer();
				list.items.add(new File([blob], 'preview.png', { type: 'image/png' }));
				previewImages.forEach((image) => list.items.add(image));
				imagesFileinputElement.files = list.files;
				
				form.submit();
			});
		}}
	>
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
			<input
				class="input input-bordered text-sm placeholder:italic"
				type="text"
				name="data"
				id="data"
				placeholder="SHAPEZ-2 ... $"
				pattern={BLUEPRINT_IDENTIFIER_REGEX.source}
				required
				bind:value={identifier}
			/>
			{#if $page.form && $page.form.invalid && $page.form.issues['data']}
				<div class="label">
					<span class="label-text-alt italic text-error">{$page.form.issues['data']}</span>
				</div>
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

				<label class="form-control" for="images-input">
					<div class="label">
						<span class="label-text">
							Images <span class="text-xs text-base-300">(optional)</span>
						</span>
						<i class="label-text-alt">max. {MAX_IMAGES} images</i>
					</div>

					<input
						class="hidden"
						name="images"
						id="images"
						type="file"
						multiple
						accept="image/png,image/jpeg,image/gif"
						bind:this={imagesFileinputElement}
					/>
					<input
						class="file-input file-input-bordered text-sm placeholder:italic"
						type="file"
						id="images-input"
						multiple
						accept="image/png,image/jpeg,image/gif"
						on:change={onPreviewImageFileChange}
					/>
					{#if $page.form && $page.form.invalid}
						<div class="label">
							<span class="label-text-alt italic text-error">{$page.form.issues['images']}</span>
						</div>
					{/if}
				</label>

				{#if previewImages.length > 0}
					<ol class="mt-4 grid auto-rows-auto grid-cols-3 gap-4">
						{#each previewImages as previewImage, index}
							<li class="group relative">
								<figure class="aspect-h-2 aspect-w-3">
									<img
										class="rounded-btn border border-base-content/20 object-cover shadow-lg"
										src={URL.createObjectURL(previewImage)}
										alt={`Preview image ${index} - ${previewImage.name}`}
									/>
								</figure>

								<span class="badge badge-secondary badge-lg absolute left-4 top-4 font-bold">
									#{index}
								</span>
								<span
									class={`absolute right-4 top-4 ${
										previewImages.length > 1 ? 'join border border-base-300' : ''
									}`}
								>
									{#if index > 0}
										<button
											class="btn btn-square btn-accent join-item btn-sm"
											title="Move to previous position"
											type="button"
											on:click={() => swapImage(index, index - 1)}
										>
											<span class="icon-[tabler--chevron-left] text-2xl">Previous</span>
										</button>
									{/if}
									{#if index < previewImages.length - 1}
										<button
											class="btn btn-square btn-accent join-item btn-sm"
											title="Move to next position"
											type="button"
											on:click={() => swapImage(index, index + 1)}
										>
											<span class="icon-[tabler--chevron-right] text-2xl">Next</span>
										</button>
									{/if}
									<button
										class="btn btn-square btn-error join-item btn-sm"
										title="Remove image"
										type="button"
										on:click={() => onRemoveImage(index)}
									>
										<span class="icon-[tabler--x] text-2xl">Remove</span>
									</button>
								</span>
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		</details>

		<div class="mt-2">
			<div class="label ml-4">
				<span class="label-text">Blueprint preview image</span>
			</div>
			<BlueprintView {identifier} {blueprint} controls={{}} bind:this={view} />
		</div>

		<button class="btn btn-primary btn-block mt-4">Upload</button>
	</form>
</section>
