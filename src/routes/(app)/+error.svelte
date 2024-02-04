<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.error?.message ?? 'Error'}</title>
</svelte:head>

<section class="mx-auto w-full max-w-5xl">
	<div class="flex flex-col items-center justify-center space-y-4">
		<i class="text-9xl font-black not-italic">{$page.status}</i>
		<h1 class="text-xl">{$page.error?.message}</h1>
	</div>
</section>
