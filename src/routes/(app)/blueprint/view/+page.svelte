<script lang="ts">
	import type { PageData } from './$types';
	import { view } from '$lib/client/blueprints';

	import Loading from '$lib/components/Loading.svelte';

	export let data: PageData;

	let isLoading = true;
</script>

<section class="mx-auto w-full max-w-5xl">
	<figure class="aspect-h-3 aspect-w-4 relative">
		<canvas
			class="outline-none data-[loading=true]:pointer-events-none"
			tabindex="-1"
			data-loading={isLoading}
			use:view={data.blueprint}
			on:load={() => {
				isLoading = false;
			}}
		/>
		{#if isLoading}
			<div
				class="absolute bottom-auto left-1/2 right-auto top-1/2 h-auto w-auto -translate-x-1/2 -translate-y-1/2"
			>
				<Loading />
			</div>
		{/if}
		<figcaption class="sr-only">Blueprint Viewer</figcaption>
	</figure>
</section>
