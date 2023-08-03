<script lang="ts">
	import { page } from '$app/stores';

	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	{#key $page.data}
		<title>{$page.data.seo.title}</title>
		<meta name="description" content={$page.data.seo.description} />
		{#if $page.data.seo.keywords}
			<meta name="keywords" content={$page.data.seo.keywords.join(', ')} />
		{/if}

		{#if $page.data.seo.og}
			<meta property="og:title" content={$page.data.seo.og.title ?? $page.data.seo.title} />
			<meta property="og:type" content={$page.data.seo.og.type} />
			<meta property="og:image" content={$page.data.seo.og.image} />
			<meta property="og:url" content={$page.data.seo.og.url} />
		{/if}
	{/key}
</svelte:head>

<Header />

<main class="flex min-h-screen flex-col overflow-y-auto overflow-x-hidden py-8">
	{#key $page.data}
		{#if $page.data.seo?.title}
			<h1 class="sr-only">{$page.data.seo.title}</h1>
		{/if}
	{/key}

	<slot />
</main>

<Footer />
