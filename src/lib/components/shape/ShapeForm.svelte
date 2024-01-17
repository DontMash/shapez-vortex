<script lang="ts">
	import { clear } from '$lib/client/actions/clear';
	import { share } from '$lib/client/actions/share';

	import ArrowRightAltIcon from '$lib/components/icons/ArrowRightAltIcon.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import ShareFilledIcon from '$lib/components/icons/ShareFilledIcon.svelte';

	let shapeIdentifierInputElement: HTMLInputElement;
	let isLoading: boolean;
</script>

<div
	class="flex divide-x-2 divide-neutral-900 overflow-hidden rounded-2xl border-2 border-neutral-800"
>
	<form class="flex items-center divide-x-2 divide-neutral-800" method="GET" action="/shape">
		<label class="relative h-14" for="shape-identifier" aria-label="Shape identifier">
			<span class="sr-only">Shape identifier</span>
			<input
				class="peer h-full w-[30rem] bg-stone-200 pl-3 pr-7 text-neutral-800 outline-none transition placeholder:select-none placeholder:text-stone-400 placeholder:transition hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:placeholder:text-stone-600"
				id="shape-identifier"
				name="identifier"
				placeholder="Shape identifier..."
				required
				minlength="2"
				maxlength="35"
				bind:this={shapeIdentifierInputElement}
			/>
			<button
				class="absolute right-0 top-1/2 mr-1 block w-6 -translate-y-1/2 fill-neutral-800 outline-none transition hover:fill-stone-400 focus:fill-stone-400 peer-placeholder-shown:hidden"
				type="button"
				aria-label="Clear search input"
				use:clear={{ inputElement: shapeIdentifierInputElement }}
			>
				<CloseIcon />
			</button>
		</label>
		<button
			class="inline-block h-14 w-14 bg-cyan-500 fill-neutral-800 p-3 leading-none outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
			type="submit"
			aria-label="View shape"
		>
			<ArrowRightAltIcon />
		</button>
	</form>
	<button
		class="inline-block h-14 w-14 bg-neutral-950 fill-stone-100 p-3 leading-none outline-none transition hover:bg-neutral-900 focus-visible:bg-neutral-900 active:bg-black"
		type="button"
		aria-label="Share page link"
		on:click={() => (isLoading = true)}
		on:share={() => (isLoading = false)}
		use:share
	>
		<figure class="data-[loading=true]:animate-spin" data-loading={isLoading}>
			<ShareFilledIcon />
		</figure>
	</button>
</div>
