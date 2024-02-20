<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type DialogEvents = {
		confirm: FormData | undefined;
		cancel: void;
	};
	const dispatch = createEventDispatcher<DialogEvents>();

	export let open: boolean;
	let dialog: HTMLDialogElement;
	let form: HTMLFormElement;

	$: {
		open ? dialog?.showModal() : dialog?.close();
	}
	function onDialogClose(event: Event) {
		const target = event.target as HTMLDialogElement;
		if (target.returnValue === 'confirm') {
			const formData = new FormData(form);
			dispatch('confirm', formData);
		} else {
			dispatch('cancel');
		}
	}
</script>

<dialog
	class="modal backdrop:backdrop-blur"
	bind:this={dialog}
	on:close={onDialogClose}
>
	<form
		class="modal-box border border-base-content border-opacity-20"
		method="dialog"
		bind:this={form}
	>
		<slot />
		<div class="mt-4 flex justify-end space-x-2">
			<slot name="options">
				<button
					class="btn btn-primary"
					title="Confirm"
					value="confirm"
				>
					OK
				</button>
			</slot>
			<button
				class="btn btn-neutral"
				title="Cancel"
				value="cancel"
			>
				Cancel
			</button>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
	  <button>close</button>
	</form>
</dialog>
