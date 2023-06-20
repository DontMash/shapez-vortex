<script lang="ts">
	import { ToastType, add } from '$lib/components/toast/toast.service';

	import ArrowRightAlt from '$lib/components/icons/ArrowRightAlt.svelte';
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
	import ShareIcon from './icons/ShareIcon.svelte';

	let shapeIdentifierInputElement: HTMLInputElement;

	const onClear = () => {
		shapeIdentifierInputElement.value = '';
		shapeIdentifierInputElement.focus();
	};

	const TOAST_DURATION = 3000;

	let isLoading: boolean;

	const onShare = () => {
		isLoading = true;

		navigator.clipboard
			.writeText(window.location.href)
			.then(() => add('Link copied', TOAST_DURATION))
			.catch(() => {
				add('Cannot copy link!', TOAST_DURATION, ToastType.Error);
			})
			.finally(() => (isLoading = false));
	};
</script>

<form
	class="flex items-center divide-x-2 divide-black border-2 border-neutral-900"
	method="GET"
	action="/shape"
>
	<label class="relative h-12" for="identifier" aria-label="Shape identifier">
		<span class="sr-only">Shape identifier</span>
		<input
			class="peer h-full w-[35ch] bg-stone-200 pl-2 pr-7 text-neutral-800 outline-none transition placeholder:select-none placeholder:text-stone-400 placeholder:transition hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:placeholder:text-stone-600"
			name="identifier"
			placeholder="Shape identifier..."
			required
			minlength="8"
			maxlength="35"
			bind:this={shapeIdentifierInputElement}
		/>
		<button
			class="absolute right-0 top-1/2 mr-1 block w-6 -translate-y-1/2 fill-neutral-800 outline-none transition hover:fill-stone-400 focus:fill-stone-400 peer-placeholder-shown:hidden"
			type="button"
			aria-label="Clear search input"
			on:click={() => onClear()}
		>
			<CloseIcon />
		</button>
	</label>
	<button
		class="inline-block h-12 w-12 bg-cyan-500 fill-neutral-800 p-1 leading-none outline-none transition hover:bg-cyan-400 focus-visible:bg-cyan-400 active:bg-cyan-600"
		type="submit"
	>
		<ArrowRightAlt />
	</button>
	<button
		class="inline-block h-12 w-12 bg-neutral-900 fill-stone-100 p-1 leading-none outline-none transition hover:bg-neutral-800 focus-visible:bg-neutral-800 active:bg-black"
		type="button"
		on:click={() => onShare()}
	>
		<figure class="data-[loading=true]:animate-spin" data-loading={isLoading}>
			<ShareIcon />
		</figure>
	</button>
</form>
