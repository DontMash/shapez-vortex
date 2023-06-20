<script lang="ts">
	import { fly } from 'svelte/transition';

	import ToastComponent from './Toast.svelte';
	import { subscribe, type Toast } from './toast.service';

	const TOAST_TRANSITION_DURATION = 300;
	let currentToast: Toast | undefined;

	subscribe((toast) => {
		if (!toast) return;
		currentToast = toast;

		setTimeout(() => (currentToast = undefined), toast.duration - TOAST_TRANSITION_DURATION);
	});
</script>

{#if currentToast}
	<figure transition:fly={{ y: -100, duration: TOAST_TRANSITION_DURATION }}>
		<ToastComponent type={currentToast.type}>
			{currentToast.message}
		</ToastComponent>
	</figure>
{/if}
