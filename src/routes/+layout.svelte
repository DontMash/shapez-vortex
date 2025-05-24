<script lang="ts">
  import '../app.css';
  import '@fontsource-variable/outfit';

  import { page } from '$app/state';
  import { add } from '$lib/client/toast.service';

  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Toaster from '$lib/components/toast/Toaster.svelte';

  let { children } = $props();

  function onError(event: Event) {
    const errorEvent = event as ErrorEvent;
    add({ message: errorEvent.message ?? 'Error', type: 'ERROR' });
  }
  const BASE_KEYWORDS = new Set([
    'Shapez',
    'Shapez 2',
    'Visualization',
    'Tools',
  ]);
  function getKeywords(pageKeywords: Array<string>): Array<string> {
    const keywords = new Set([...BASE_KEYWORDS]);
    pageKeywords.forEach((keyword) => keywords.add(keyword));
    return Array.from(keywords);
  }

  // search: Ascending/Descending as toggle
  // search: clear filter option
  // combobox horizontal overflow
  // use embla instead of swiper
  // svelte client actions
  // update tailwind
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
