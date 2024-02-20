<script lang="ts">
	import type { PageData } from './$types';

	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
			<span class="inline-block h-6 w-6 fill-stone-100">
				<PersonIcon />
			</span>
			<span>
				{data.profile.displayname}
			</span>
		</h2>
	</header>

	<ul class="flex flex-col items-center justify-center space-y-4">
		<li>
			<a class="underline" href={`/user/${data.profile.username}/blueprints`}>Blueprints</a>
		</li>
	</ul>
</section>
