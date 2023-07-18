<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';
</script>

<header class="pointer-events-none sticky left-0 right-0 top-0 mx-auto w-full max-w-7xl p-6">
	<div class="absolute right-8 top-8 z-50">
		<Toaster />
	</div>

	<nav class="pointer-events-auto inline-block">
		<Logo />
		<slot name="navigation" />
	</nav>
</header>

<main class="flex min-h-screen flex-col overflow-y-auto overflow-x-hidden">
	<slot />
</main>

<Footer />
