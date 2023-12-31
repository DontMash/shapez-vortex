<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="mx-auto flex w-full max-w-5xl flex-col items-center justify-center space-y-4">
	<i class="text-9xl font-black not-italic">{$page.status}</i>
	<h1 class="text-xl">{$page.error?.message}</h1>
</section>
