<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

	import DataObjectIcon from '$lib/components/icons/DataObjectIcon.svelte';
	import DomainIcon from '$lib/components/icons/DomainIcon.svelte';
	import FileUploadIcon from '$lib/components/icons/FileUploadIcon.svelte';
	import SyncIcon from '$lib/components/icons/SyncIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';

	export let data: PageData;

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
		input.form?.reset();
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4">
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6">
					<DomainIcon />
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

	<form action="?/view" method="post">
		<label class="form-control h-80" for="blueprint-identifier">
			<div class="label">
				<span class="label-text sr-only">Blueprint identifier</span>
			</div>
			<textarea
				class={`textarea textarea-bordered textarea-lg h-full w-full resize-none ${
					$page.form && $page.form.invalid && $page.form.identifier && 'textarea-error'
				}`}
				name="identifier"
				id="blueprint-identifier"
				placeholder="Blueprint identifier..."
				required
			/>
			<div class="label">
				{#if $page.form && $page.form.invalid && $page.form.identifier}
					<span class="label-text-alt font-medium italic text-error">
						Blueprint data is invalid
					</span>
				{/if}
			</div>
		</label>

		<div class="join flex">
			<div class="form-control join-item justify-center bg-secondary">
				<label class="label cursor-pointer space-x-4 px-4" for="blueprint-update">
					<span class="label-text shrink-0 text-secondary-content font-bold">Update</span>
					<span class="sr-only">blueprint to current game version</span>
					<input type="checkbox" class="toggle" id="blueprint-update" checked />
				</label>
			</div>
			<button class="btn btn-secondary join-item flex-grow" title="View blueprint">
				<span class="inline-block h-6 w-6 fill-secondary-content">
					<VisibilityIcon />
				</span>
				View
			</button>
		</div>
	</form>

	<form class="mt-4" action="/blueprint/view/?/upload" method="post" enctype="multipart/form-data">
		<label class="btn btn-primary btn-block" for="blueprint-file">
			<input
				class="sr-only"
				id="blueprint-file"
				name="file"
				type="file"
				accept={BLUEPRINT_FILE_FORMAT}
				required
				on:change={(event) => onFileChange(event)}
			/>
			<span class="inline-block h-6 w-6">
				<FileUploadIcon />
			</span>
			Load
			<span class="sr-only">blueprint from file</span>
		</label>
	</form>
</section>

<section class="mx-auto mt-32 grid w-full max-w-5xl grid-cols-2 gap-8" id="more-features">
	<div class="indicator w-full">
		<span
			class="indicator-item indicator-start indicator-top h-12 w-12 rounded-btn bg-secondary fill-secondary-content p-2"
		>
			<DataObjectIcon />
		</span>
		<div class="card card-bordered w-full bg-base-200">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Blueprint Codec</h2>
				<p>Decode or encode blueprints. <br /> Apply changes and make them your own!</p>
			</div>

			<a
				class="btn btn-secondary no-animation btn-block rounded-t-none"
				href="/blueprint/codec"
				title="Blueprint Codec"
			>
				Start
			</a>
		</div>
	</div>

	<div class="indicator w-full">
		<span
			class="indicator-item indicator-start indicator-top h-12 w-12 rounded-btn bg-secondary fill-secondary-content p-2"
		>
			<SyncIcon />
		</span>
		<div class="card card-bordered w-full bg-base-200">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Blueprint Converter</h2>
				<p>Convert existing blueprints <br />to a specific game version.</p>
			</div>

			<a
				class="btn btn-secondary no-animation btn-block rounded-t-none"
				href="/blueprint/convert"
				title="Blueprint Converter"
			>
				Start
			</a>
		</div>
	</div>
</section>
