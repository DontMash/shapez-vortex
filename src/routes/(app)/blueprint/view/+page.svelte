<script lang="ts">
	import type { PageData } from './$types';

	import BlueprintViewer from '$lib/components/blueprint/BlueprintViewer.svelte';

	export let data: PageData;
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<BlueprintViewer
		identifier={data.blueprint.identifier}
		blueprint={data.blueprint.data}
		controls
	/>
</section>
