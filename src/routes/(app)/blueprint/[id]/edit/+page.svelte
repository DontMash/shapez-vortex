<script lang="ts">
	import type { PageData } from './$types';

	import BlueprintForm from '$lib/components/blueprint/BlueprintForm.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl px-4 lg:px-0">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-input px-4 pb-4">
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--edit] align-text-bottom text-2xl">Edit</span>
				{data.seo.title}
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<BlueprintForm
		data={{
			form: data.form,
			type: 'update',
			tags: data.tags,
			record: data.blueprint.entry,
			images: data.blueprint.images
		}}
	/>
</section>
