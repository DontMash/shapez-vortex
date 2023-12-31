<section class="mx-auto w-full max-w-5xl">
	<form
		class="flex flex-col divide-y-2 divide-neutral-900 border-2 border-neutral-900 overflow-hidden rounded-4xl"
		action="/blueprint/view"
	>
		<label
			class="flex h-40 flex-col bg-stone-200 px-6 py-4 text-neutral-800 transition focus-within:bg-stone-100 hover:bg-stone-100"
			for="blueprint-identifier"
		>
			<span class="sr-only">Blueprint identifier</span>
			<textarea
				class="h-full w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:select-none placeholder:text-stone-400 focus-visible:placeholder:text-stone-600"
				name="blueprint-identifier"
				id="blueprint-identifier"
				placeholder="Blueprint identifier..."
				required
			/>
		</label>
		<button
			class="inline-block h-12 bg-cyan-500 leading-none text-neutral-800 outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
			type="submit">View</button
		>
	</form>
</section>
