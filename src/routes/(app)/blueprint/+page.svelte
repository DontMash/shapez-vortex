<script lang="ts">
	import { BLUEPRINT_FILE_FORMAT } from '$lib/blueprint.types';

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
		input.form?.reset();
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<div
		class="divide-y-2 divide-neutral-900 overflow-hidden rounded-4xl border-2 border-neutral-900"
	>
		<form class="flex flex-col divide-y-2 divide-neutral-900" method="post" action="?/view">
			<label
				class="flex h-96 flex-col bg-stone-200 px-6 py-4 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
				for="blueprint-identifier"
			>
				<textarea
					class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
					name="identifier"
					id="blueprint-identifier"
					placeholder="Blueprint identifier..."
					required
				/>
				<span class="sr-only">Blueprint identifier</span>
			</label>
			<div class="flex h-12 divide-x-2 divide-neutral-900 bg-neutral-800">
				<label
					class="inline-flex items-center space-x-2 px-6 focus-within:bg-neutral-700 hover:bg-neutral-700"
					for="blueprint-update"
				>
					<input type="checkbox" name="update" id="blueprint-update" />
					<span>Update</span>
					<span class="sr-only">blueprint to current game version</span>
				</label>
				<button
					class="inline-block w-full bg-neutral-800 px-6 leading-none outline-none transition hover:bg-neutral-700 focus-visible:bg-neutral-700 active:bg-black"
					title="View blueprint"
					type="submit"
				>
					View
				</button>
			</div>
		</form>
		<form
			class="flex flex-col"
			method="post"
			action="/blueprint/view/?/upload"
			enctype="multipart/form-data"
		>
			<label
				class="inline-flex h-12 flex-col items-center justify-center bg-cyan-500 leading-none text-neutral-800 outline-none transition focus-within:bg-cyan-400 hover:bg-cyan-400 active:bg-cyan-600"
				for="blueprint-file"
			>
				<input
					class="sr-only"
					id="blueprint-file"
					name="file"
					type="file"
					accept={BLUEPRINT_FILE_FORMAT}
					required
					on:change={(event) => onFileChange(event)}
				/>
				<span>Load</span>
			</label>
		</form>
	</div>
</section>
