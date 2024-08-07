<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

	export let data: PageData;

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
	>
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--schema] align-text-bottom text-2xl" />
				{data.seo.title}
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<form class="space-y-4 px-4 lg:px-0" action="?/view" method="post">
		<label class="form-control h-80" for="blueprint-identifier">
			<div class="label">
				<span class="label-text">Blueprint identifier</span>
				<i class="label-text-alt">
					max. 12500 characters
					<a class="link font-bold transition-colors hover:!text-primary" href="/blueprint/upload">
						(limitless?)
					</a>
				</i>
			</div>
			{#if $page.form && $page.form.invalid && $page.form.identifier}
				<textarea
					class="textarea textarea-bordered textarea-error h-full w-full resize-none"
					name="identifier"
					id="blueprint-identifier"
					placeholder="SHAPEZ-2 ... $"
					maxlength="12500"
					required
					value={$page.form.identifier ?? null}
				/>
				<div class="label">
					<span class="label-text-alt font-medium italic text-error">
						Blueprint data is invalid
					</span>
				</div>
			{:else}
				<textarea
					class="textarea textarea-bordered h-full w-full resize-none"
					name="identifier"
					id="blueprint-identifier"
					placeholder="SHAPEZ-2 ... $"
					maxlength="12500"
					required
				/>
			{/if}
		</label>

		<div class="join flex">
			<div class="form-control join-item justify-center bg-secondary">
				<label class="label cursor-pointer space-x-4 px-4" for="blueprint-update">
					<span class="label-text shrink-0 font-bold text-secondary-content">Update</span>
					<span class="sr-only">blueprint to current game version</span>
					<input type="checkbox" class="toggle" id="blueprint-update" checked />
				</label>
			</div>
			<button class="btn btn-secondary join-item flex-grow" title="View blueprint">
				<span class="icon-[tabler--eye] text-lg" />
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
			<span class="icon-[tabler--file-upload] text-lg" />
			Load
			<span class="sr-only">blueprint from file</span>
		</label>
	</form>
</section>

<section class="mx-auto mt-32 grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 px-10" id="more-features">
	<div class="indicator w-full">
		<span
			class="indicator-item indicator-start indicator-top flex h-12 w-12 items-center justify-center rounded-btn bg-secondary text-2xl text-secondary-content"
		>
			<span class="icon-[tabler--braces]" />
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
			class="indicator-item indicator-start indicator-top flex h-12 w-12 items-center justify-center rounded-btn bg-secondary p-2 text-2xl text-secondary-content"
		>
			<span class="icon-[tabler--refresh]" />
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
