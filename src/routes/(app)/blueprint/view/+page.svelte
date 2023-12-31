<script lang="ts">
	import type { PageData } from './$types';
	import { view } from '$lib/client/buildings';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<figure class="aspect-h-3 aspect-w-4">
		<canvas class="outline-none" use:view={data.blueprint} tabindex="-1" />
		<figcaption class="sr-only">Blueprint Viewer</figcaption>
	</figure>
</section>
