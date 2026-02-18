<script lang="ts">
  import '../app.css';
  import '@fontsource-variable/outfit';

  import { page } from '$app/state';
  import ToastService from '$lib/client/toast.svelte';

  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Toaster from '$lib/components/toast/Toaster.svelte';

  let { children } = $props();

  const toastService = ToastService.instance;

  function onError(event: Event) {
    const errorEvent = event as ErrorEvent;
    toastService.add({ message: errorEvent.message ?? 'Error', type: 'ERROR' });
  }
  const BASE_KEYWORDS = ['Shapez', 'Shapez 2', 'Visualization', 'Tools'];
  function getKeywords(pageKeywords: Array<string>): Array<string> {
    return [...new Set([...BASE_KEYWORDS, ...pageKeywords])];
  }
</script>

<svelte:head>
  {#key page.data}
    {#if page.data.seo}
      <title>{page.data.seo.title}</title>
      <meta name="description" content={page.data.seo.description} />
      {#if page.data.seo.keywords}
        <meta
          name="keywords"
          content={getKeywords(page.data.seo.keywords).join(', ')}
        />
      {/if}

      <meta
        property="og:title"
        content={page.data.seo.og?.title ??
          `${page.data.seo.title} - ${page.data.seo.description}`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={page.data.seo.og?.image ?? `${page.url.origin}/favicon.png`}
      />
      <meta property="og:url" content={page.url.href} />
    {/if}
  {/key}
</svelte:head>
<svelte:window onerror={(event) => onError(event)} />

<Header />

<main class="flex min-h-screen flex-col overflow-x-hidden">
  {@render children()}
</main>

<Toaster />

<Footer />
