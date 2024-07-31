<script lang="ts">
	import type { PageData } from './$types';

	import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

	export let data: PageData;
</script>

<section class="relative mx-auto w-full max-w-5xl">
	<BlueprintView
		identifier={data.blueprint.entry.data}
		blueprint={data.blueprint.data}
		controls={{ download: data.user && data.user.verified, zoom: true, utils: true }}
	/>
</section>
