<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="mx-auto w-full max-w-5xl">
	<h2 class="flex items-center justify-center divide-x-2 divide-base-content font-medium">
		<span class="px-6 py-4 text-5xl">{$page.status}</span>
		<span class="px-6 py-4 text-2xl">{$page.error?.message}</span>
	</h2>
</section>
