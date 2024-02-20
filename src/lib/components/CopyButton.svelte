<script lang="ts">
	import { copy } from '$lib/client/actions/clipboard';

	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';

	export let value: any;

	let isLoading = false;
</script>

<button
	class="btn btn-accent btn-square fill-accent-content data-[loading=true]:animate-spin"
	data-loading={isLoading}
	type="button"
	title="Copy"
	on:click={() => (isLoading = true)}
	use:copy={{ value }}
	on:copy={() => (isLoading = false)}
>
	<span class="sr-only">Copy</span>
	<span class="inline-block h-6 w-6">
		<CopyIcon />
	</span>
</button>
