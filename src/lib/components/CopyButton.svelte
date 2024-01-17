<script lang="ts">
	import CopyIcon from './icons/CopyIcon.svelte';

	import { copy } from '$lib/client/actions/clipboard';

	type Color = 'light' | 'dark';

	export let value: any;
	export let color: Color = 'light';

	const colorVariants: Record<Color, string> = {
		light: 'fill-stone-200 hover:fill-stone-100 focus-visible:fill-stone-100',
		dark: 'fill-neutral-900 hover:fill-neutral-800 focus-visible:fill-neutral-800'
	};
	let isLoading = false;
</script>

<button
	class={`${colorVariants[color]} h-6 w-6 outline-none transition`}
	type="button"
	on:click={() => (isLoading = true)}
	use:copy={{ value }}
	on:copy={() => (isLoading = false)}
>
	<span class="sr-only">Copy</span>
	<div class="data-[loading=true]:animate-spin" data-loading={isLoading}>
		<CopyIcon />
	</div>
</button>
