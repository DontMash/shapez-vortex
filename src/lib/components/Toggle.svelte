<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type CheckboxEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export let id: string;
	export let label: string;

	let isChecked: boolean;
	const dispatch = createEventDispatcher<{ change: boolean }>();
	const onChange = (event: CheckboxEvent) => {
		isChecked = event.currentTarget.checked;
		dispatch('change', isChecked);
	};
</script>

<label
	class="h-12 w-12 cursor-pointer bg-stone-200 p-2 hover:bg-stone-100 focus-within:bg-stone-100 active:bg-stone-300"
	for={id}
>
	<span class="sr-only">{label}</span>
	<input
		class="peer sr-only"
		type="checkbox"
		{id}
		name={id}
		on:change={(event) => onChange(event)}
	/>
	<figure class="h-full w-full fill-neutral-900">
		{#if isChecked}
			<slot name="checked" />
		{:else}
			<slot name="unchecked" />
		{/if}
	</figure>
</label>
