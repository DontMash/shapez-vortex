<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<Header />

<main class="flex min-h-screen flex-col overflow-x-hidden">
  {@render children()}
</main>

<Footer />
