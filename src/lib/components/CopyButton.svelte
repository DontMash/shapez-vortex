<script lang="ts">
	import { copy } from '$lib/client/actions/clipboard';
	import { add } from '$lib/client/toast/toast.service';

	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';

	export let value: string;

	let isLoading = false;
</script>

<button
	class="btn btn-square btn-accent fill-accent-content data-[loading=true]:animate-spin"
	data-loading={isLoading}
	type="button"
	title="Copy"
	on:click={() => (isLoading = true)}
	use:copy={{ value }}
	on:copy={() => {
		isLoading = false;
		add({ message: 'Content copied' });
	}}
	on:error={(event) => {
		isLoading = false;
		add({ message: event.detail.message, type: 'ERROR' });
	}}
>
	<span class="sr-only">Copy</span>
	<span class="inline-block h-6 w-6">
		<CopyIcon />
	</span>
</button>
