<script lang="ts">
	import CopyIcon from './icons/CopyIcon.svelte';

	import { ToastType, add } from '$lib/components/toast/toast.service';

	type Color = 'light' | 'dark';
	const TOAST_DURATION = 3000;

	export let value: string;
	export let color: Color = 'light';

	const colorVariants: Record<Color, string> = {
		light: 'fill-stone-200 hover:fill-stone-100 focus-visible:fill-stone-100',
		dark: 'fill-neutral-900 hover:fill-neutral-800 focus-visible:fill-neutral-800'
	};
	let isLoading = false;

	const onCopy = () => {
		isLoading = true;

		navigator.clipboard
			.writeText(value)
			.then(() => add('Content copied', TOAST_DURATION))
			.catch(() => {
				add('Cannot copy content!', TOAST_DURATION, ToastType.Error);
			})
			.finally(() => (isLoading = false));
	};
</script>

<button
	class={`${colorVariants[color]} h-6 w-6 outline-none transition`}
	on:click={() => onCopy()}
>
	<span class="sr-only">Copy</span>
	<figure class="data-[loading=true]:animate-spin" data-loading={isLoading}>
		<CopyIcon />
	</figure>
</button>
