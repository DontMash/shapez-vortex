<script lang="ts">
	import { add } from '$lib/client/toast.service';
	import { BLUEPRINT_TAG_REGEX, BLUEPRINT_TAGS_MAX, type BlueprintTag } from '$lib/blueprint.types';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import { Combobox } from '$lib/components/combobox';

	export let data: Array<BlueprintTag>;
	export let value: Array<BlueprintTag> = [];

	let tagCombobox: Combobox;
	let selectedTags: Set<string> = new Set();
	$: {
		selectedTags = new Set([...value.map((tag) => tag.name), ...selectedTags]);
	}
	$: tagOptions = data.filter((tag) => !selectedTags.has(tag.name));
	let tagSelectInput = '';

	function addTag(value: string) {
		if (selectedTags.size >= BLUEPRINT_TAGS_MAX) {
			return add({
				message: `Too many blueprint tags (max. ${BLUEPRINT_TAGS_MAX})`,
				type: 'ERROR'
			});
		}

		selectedTags.add(value);
		selectedTags = selectedTags;
	}
</script>

<label class="form-control" for="tags">
	<div class="label">
		<span class="label-text">
			Tags <span class="text-xs text-base-300">(optional)</span>
		</span>
		<span class="label-text-alt italic">
			max. {BLUEPRINT_TAGS_MAX} tags
		</span>
	</div>
	<div class="flex flex-wrap gap-x-1 gap-y-2 {selectedTags.size > 0 ? 'mb-2' : ''}">
		{#each selectedTags as tag}
			<Badge class="h-8 space-x-1 pr-1" variant="outline">
				<span>#{tag}</span>
				<Button
					class="size-6 p-0"
					variant="ghost"
					size="icon"
					on:click={() => {
						selectedTags.delete(tag);
						selectedTags = selectedTags;
					}}
				>
					<span class="icon-[tabler--x]" />
					<span class="sr-only">Remove tag {tag}</span>
				</Button>
			</Badge>
		{/each}
	</div>
	<input type="hidden" name="tags" value={[...selectedTags].join(',')} />
	<Combobox
		options={tagOptions.map((tag) => ({ label: tag.name, value: tag.name }))}
		placeholder="Select tags..."
		on:input={(event) => {
			tagSelectInput = event.detail;
		}}
		on:value={(event) => addTag(event.detail)}
		bind:this={tagCombobox}
	>
		{#if tagSelectInput && BLUEPRINT_TAG_REGEX.test(tagSelectInput) && !selectedTags.has(tagSelectInput) && !tagOptions.find((tag) => tag.name === tagSelectInput)}
			<Command.Separator />
			<Command.Group alwaysRender>
				<Command.Item
					class="px-8 italic"
					value={tagSelectInput}
					alwaysRender
					onSelect={() => {
						addTag(tagSelectInput);
						tagCombobox.close();
					}}
				>
					#{tagSelectInput}
				</Command.Item>
			</Command.Group>
		{/if}
	</Combobox>
</label>
