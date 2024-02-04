<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<ul class="flex flex-col items-center justify-center space-y-4">
		<li>
			<a class="underline" href={`/user/${data.profile.username}/library/blueprint`}>Blueprint Library</a>
		</li>
		<li>
			<a class="underline" href={`/user/${data.profile.username}/library/shape`}>Shape Library</a>
		</li>
	</ul>
</section>
