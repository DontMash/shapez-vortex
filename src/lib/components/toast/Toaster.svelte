<script lang="ts">
	import { toastStore, type ToastType } from '$lib/client/toast/toast.service';

	import CheckCircleIcon from '$lib/components/icons/CheckCircleIcon.svelte';
	import DangerousIcon from '$lib/components/icons/DangerousIcon.svelte';
	import InfoIcon from '$lib/components/icons/InfoIcon.svelte';
	import WarningIcon from '$lib/components/icons/WarningIcon.svelte';

	const ALERT_TYPES: Record<ToastType, string> = {
		INFO: 'alert-info',
		SUCCESS: 'alert-success',
		WARNING: 'alert-warning',
		ERROR: 'alert-error'
	};
</script>

<div class="toast-right toast toast-bottom z-50">
	{#each $toastStore.reverse() as toast}
		<figure role="alert" class={`alert ${ALERT_TYPES[toast.type]} text-base-content`}>
			{#if toast.type === 'SUCCESS'}
				<span class="inline-block h-6 w-6 fill-base-content">
					<CheckCircleIcon />
				</span>
			{:else if toast.type === 'WARNING'}
				<span class="inline-block h-6 w-6 fill-base-content">
					<WarningIcon />
				</span>
			{:else if toast.type === 'ERROR'}
				<span class="inline-block h-6 w-6 fill-base-content">
					<DangerousIcon />
				</span>
			{:else}
				<span class="inline-block h-6 w-6 fill-base-content">
					<InfoIcon />
				</span>
			{/if}
			{toast.message}
		</figure>
	{/each}
</div>
