<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { cn } from '$lib/components/ui/utils.js';
	import type { ComboboxOption } from '.';

	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';

	export let placeholder: string = 'Select...';
	export let options: Array<ComboboxOption>;
	let className: string | undefined | null = undefined;
	export { className as class };

	const dispatchValue = createEventDispatcher<{ value: string }>();
	const dispatchInput = createEventDispatcher<{ input: string }>();

	let open = false;
	let value = '';

	$: selectedValue = options.find((f) => f.value === value)?.label ?? placeholder;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		close();
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	export function close() {
		open = false;
	}

	function onInput(event: KeyboardEvent) {
		const input = event.target as HTMLInputElement;
		if (!input) return;

		setTimeout(() => {
			dispatchInput('input', input.value);
		}, 100);
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class={cn('w-full justify-between', className)}
		>
			{selectedValue}
			<span class="icon-[tabler--caret-up-down] ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0">
		<Command.Root onKeydown={onInput} loop>
			<Command.Input {placeholder} />
			<Command.Empty>
				<slot name="empty">No results found.</slot>
			</Command.Empty>
			<Command.Group>
				{#each options as option}
					<Command.Item
						id={option.id}
						value={option.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							dispatchValue('value', value);
						}}
					>
						<span
							class={cn(
								'icon-[tabler--check] mr-2 h-4 w-4',
								value !== option.value && 'text-transparent'
							)}
						/>
						{option.label}
					</Command.Item>
				{/each}
			</Command.Group>
			<slot></slot>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
