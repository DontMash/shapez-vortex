<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<Header />

<main class="flex min-h-screen flex-col overflow-y-auto overflow-x-hidden py-8">
	<slot />
</main>

<Footer />
