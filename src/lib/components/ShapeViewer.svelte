<script lang="ts">
	import { view } from '$lib/client/shapes';
	import type { ShapeData } from '$lib/shape.types';

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;
</script>

<figure class="aspect-h-3 aspect-w-4">
	<canvas use:view={{ data, isExtended, isExpanded }} />
	<figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
