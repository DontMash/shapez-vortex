<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';
</script>

<svelte:head>
	<title>Shapez Visualizer</title>
</svelte:head>

<div class="fixed right-8 top-8 z-50">
	<Toaster />
</div>

<main class="flex min-h-screen flex-col overflow-y-auto overflow-x-hidden">
	<slot />
</main>

<Footer />
