<script lang="ts">
	import type { PageData } from './$types';

	import Research from '$lib/components/research/Research.svelte';
	import ScienceIcon from '$lib/components/icons/ScienceIcon.svelte';

	export let data: PageData;
</script>

<section>
	<header
		class="mx-auto mb-12 flex w-full max-w-5xl items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="fill-stone-100 inline-block h-6 w-6">
					<ScienceIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<div class="-mx-4">
		<Research data={data.research} />
	</div>
</section>
