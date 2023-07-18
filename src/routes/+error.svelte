<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="mx-auto w-full max-w-5xl">
	<h1 class="flex items-center justify-center divide-x-2 divide-stone-100">
		<span class="p-4 text-5xl leading-none">{$page.status}</span>
		<span class="p-4 text-2xl leading-none">{$page.error?.message}</span>
	</h1>
</section>
