<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { add } from '$lib/client/toast/toast.service';

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';

	function onError(event: Event) {
		const errorEvent = event as ErrorEvent;
		add(errorEvent.message ?? 'Error', 3000, 'ERROR');
	}
	const BASE_KEYWORDS = new Set(['Shapez', 'Shapez 2', 'Visualization', 'Tools']);
	function getKeywords(pageKeywords: Array<string>): Array<string> {
		const keywords = new Set([...BASE_KEYWORDS]);
		pageKeywords.forEach((keyword) => keywords.add(keyword));
		return Array.from(keywords);
	}
</script>

<svelte:head>
	{#key $page.data}
		{#if $page.data.seo}
			<title>{$page.data.seo.title}</title>
			<meta name="description" content={$page.data.seo.description} />
			{#if $page.data.seo.keywords}
				<meta name="keywords" content={getKeywords($page.data.seo.keywords).join(', ')} />
			{/if}

			{#if $page.data.seo.og}
				<meta
					property="og:title"
					content={$page.data.seo.og.title ??
						`${$page.data.seo.title} - ${$page.data.seo.description}`}
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content={$page.data.seo.og.image ?? `${$page.url.origin}/favicon.png`}
				/>
				<meta property="og:url" content={$page.url.href} />
			{/if}
		{/if}
	{/key}
</svelte:head>
<svelte:window on:error={(event) => onError(event)} />

<Header />
<main
	class="flex min-h-[calc(100vh_-_116px)] flex-col overflow-y-auto overflow-x-hidden px-4 pb-32 pt-8"
>
	{#key $page.data}
		{#if $page.data.seo?.title}
			<h1 class="sr-only">{$page.data.seo.title}</h1>
		{/if}
	{/key}

	<slot />
</main>
<Toaster />
<Footer />
