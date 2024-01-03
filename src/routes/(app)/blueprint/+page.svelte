<script lang="ts">
	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		input.form?.submit();
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<div
		class="divide-y-2 divide-neutral-900 overflow-hidden rounded-4xl border-2 border-neutral-900"
	>
		<form class="flex flex-col divide-y-2 divide-neutral-900" action="/blueprint/view">
			<label
				class="flex h-96 flex-col bg-stone-200 px-6 py-4 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
				for="blueprint-identifier"
			>
				<span class="sr-only">Blueprint identifier</span>
				<textarea
					class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
					name="identifier"
					id="blueprint-identifier"
					placeholder="Blueprint identifier..."
					required
				/>
			</label>
			<button
				class="inline-block h-12 bg-neutral-900 leading-none outline-none transition hover:bg-neutral-800 focus-visible:bg-neutral-800 active:bg-black"
				type="submit"
			>
				View
			</button>
		</form>
		<form class="flex flex-col" method="post" action="?/upload" enctype="multipart/form-data">
			<label
				class="inline-flex h-12 flex-col items-center justify-center bg-cyan-500 leading-none text-neutral-800 outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
				for="blueprint-file"
			>
				<input
					class="hidden"
					id="blueprint-file"
					name="file"
					type="file"
					accept=".spz2bp"
					required
					on:change={(event) => onFileChange(event)}
				/>
				<span>Load</span>
			</label>
		</form>
	</div>
</section>
