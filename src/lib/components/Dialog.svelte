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

	function onDialogClick(event: Event) {
		const target = event.target as HTMLDialogElement;
		if (event.target !== dialog) return;
		target.close();
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="border-0 bg-transparent p-0 shadow-lg backdrop:animate-fade-in backdrop:bg-neutral-800 backdrop:bg-opacity-30 backdrop:backdrop-blur-sm"
	tabindex="-1"
	bind:this={dialog}
	on:click={onDialogClick}
	on:close={onDialogClose}
>
	<form
		class="rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-8 text-stone-100"
		method="dialog"
		bind:this={form}
	>
		<slot />
		<div class="mt-4 flex justify-end space-x-2">
			<slot name="options">
				<button
					class="min-w-14 rounded-2xl border-2 border-red-800 bg-red-800 bg-opacity-70 fill-stone-100 p-3 text-lg font-medium transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-opacity-50"
					title="Confirm"
					value="confirm"
				>
					OK
				</button>
			</slot>
			<button
				class="min-w-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-3 text-lg font-medium transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				title="Cancel"
				value="cancel"
			>
				Cancel
			</button>
		</div>
	</form>
</dialog>
