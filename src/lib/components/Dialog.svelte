<script lang="ts">
	import CloseIcon from '$lib/components/icons/CloseIcon.svelte';

	export let width: 'full' | 'auto' = 'auto';

	let dialog: HTMLDialogElement;

	export function show() {
		dialog?.showModal();
	}
	export function close() {
		dialog?.close();
	}
	export function getReturnValue(): string {
		return dialog?.returnValue ?? '';
	}
</script>

<dialog class="modal backdrop-blur" on:close bind:this={dialog}>
	<div class={`modal-box border border-base-200 min-h-16 p-0 ${width === 'full' ? 'max-w-none' : ''}`}>
		<slot />

		<form method="dialog">
			<button class="btn btn-circle btn-neutral btn-sm absolute right-4 top-4 p-1">
				<CloseIcon />
				<span class="sr-only">Close</span>
			</button>
		</form>
	</div>
	<form class="modal-backdrop" method="dialog">
		<button>Close</button>
	</form>
</dialog>
