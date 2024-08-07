<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
	>
		<h2 class="text-lg font-bold">
			<span class="icon-[tabler--user] align-text-bottom text-2xl">User</span>
			{data.profile.displayname}
		</h2>
	</header>

	<ul class="flex flex-col items-center justify-center space-y-4">
		<li>
			<a class="underline" href={`/user/@${data.profile.displayname}/blueprints`}>Blueprints</a>
		</li>
	</ul>
</section>
