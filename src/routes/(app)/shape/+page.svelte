<script lang="ts">
	import { page } from '$app/stores';

	import Viewer from '$lib/components/ShapeViewer.svelte';
	import LayersIcon from '$lib/components/icons/LayersIcon.svelte';
	import LayersFilledIcon from '$lib/components/icons/LayersFilledIcon.svelte';
	import LayersClearFilledIcon from '$lib/components/icons/LayersClearFilledIcon.svelte';
	import LayersClearIcon from '$lib/components/icons/LayersClearIcon.svelte';
</script>

<section class="relative mx-auto w-full max-w-5xl">
	{#if $page.data}
		{@const shape = $page.data.shape}
		<div class="absolute left-0 top-0 z-10 flex w-full justify-center">
			<div
				class="flex divide-x-2 divide-neutral-800 overflow-hidden rounded-4xl border-2 border-neutral-800"
			>
				<form action="/shape">
					<input name="identifier" type="hidden" value={shape.data.identifier} />
					<input name="extend" type="hidden" value={!shape.extend} />
					<input name="expand" type="hidden" value={shape.expand} />
					<button
						class="h-14 w-16 cursor-pointer bg-stone-200 fill-neutral-900 py-2 pl-4 pr-2 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
						type="submit"
					>
						<span class="sr-only"> Expand all layers </span>
						{#if shape.extend}
							<LayersIcon />
						{:else}
							<LayersFilledIcon />
						{/if}
					</button>
				</form>
				<form action="/shape">
					<input name="identifier" type="hidden" value={shape.data.identifier} />
					<input name="extend" type="hidden" value={shape.extend} />
					<input name="expand" type="hidden" value={!shape.expand} />
					<button
						class="h-14 w-16 cursor-pointer bg-stone-200 fill-neutral-900 py-2 pl-2 pr-4 focus-within:bg-stone-100 hover:bg-stone-100 active:bg-stone-300"
						type="submit"
					>
						<span class="sr-only"> Expand all quarters </span>
						{#if shape.expand}
							<LayersClearIcon />
						{:else}
							<LayersClearFilledIcon />
						{/if}
					</button>
				</form>
			</div>
		</div>
		<div>
			<Viewer data={shape.data} isExtended={shape.extend} isExpanded={shape.expand} />
		</div>
	{/if}
</section>
