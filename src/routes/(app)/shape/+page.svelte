<script lang="ts">
	import { page } from '$app/stores';

	import ShapeViewer from '$lib/components/ShapeViewer.svelte';
</script>

<section class="mx-auto w-full max-w-5xl">
	{#if $page.data}
		{@const shape = $page.data.shape}
		<ShapeViewer
			data={shape.data}
			isExtended={shape.extend}
			isExpanded={shape.expand}
		/>
	{/if}
</section>
