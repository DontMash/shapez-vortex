<script lang="ts">
  import type { PageData } from './$types';

  import { Button } from 'bits-ui';
  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import { section } from '$lib/components/section';
  import { button } from '$lib/components/button';

  export let data: PageData;
</script>

<section class={section()} id="hero">
  <div class="rounded-lg border bg-layer px-4 py-12 sm:px-12 shadow-lg">
    <hgroup class="mx-auto max-w-screen-sm text-center">
      <h1 class="heading-1">Shapez Vortex</h1>
      <p class="heading-3 mt-2">
        Discover, interact and share content with the community!
      </p>
    </hgroup>

    <ul class="mt-8 flex justify-center gap-4">
      <li>
        <Button.Root
          class={button()}
          href={data.user ? '/blueprint/upload' : '/register'}
          title={data.user ? 'Upload a blueprint' : 'Create an account'}
        >
          Get Started
        </Button.Root>
      </li>
      <li>
        <Button.Root
          class={button({ kind: 'outline', intent: 'secondary' })}
          href="#features"
          title="Checkout Shapez Vortex features"
        >
          Features
        </Button.Root>
      </li>
    </ul>
  </div>
</section>

<section
  class="mx-auto mt-16 w-full max-w-5xl px-4 md:mt-24 lg:px-0"
  id="features"
>
  <div
    class="mx-auto grid max-w-screen-sm grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-4"
  >
    <h2 class="sr-only">Features</h2>

    <div class="card card-bordered bg-base-200 shadow-xl">
      <figure>
        <a class="w-full" href="/shape" title="Shape Viewer">
          <img
            class="h-64 w-full object-cover"
            src="/shape-viewer-example.png"
            alt="Example of a 3D shape"
          />
        </a>
      </figure>

      <div class="card-body">
        <h3 class="card-title">Shape Viewer</h3>
        <p>
          Explore multiple layers and parts of a 3D visualization of a shape.
        </p>
      </div>

      <a
        class="btn btn-primary no-animation btn-block rounded-t-none"
        href="/shape"
        title="Shape Viewer"
      >
        Start
        <span class="sr-only">Shape Viewer</span>
      </a>
    </div>

    <div class="card card-bordered bg-base-200 shadow-xl">
      <figure>
        <a class="w-full" href="/blueprint" title="Blueprint Viewer">
          <img
            class="h-64 w-full object-cover"
            src="/blueprint-viewer-example.png"
            alt="Example of a 3D blueprint"
          />
        </a>
      </figure>

      <div class="card-body">
        <h3 class="card-title">Blueprint Viewer</h3>
        <p>View your blueprints in 3D and share them with others.</p>
      </div>

      <a
        class="btn btn-primary no-animation btn-block rounded-t-none"
        href="/blueprint"
        title="Blueprint Viewer"
      >
        Start
        <span class="sr-only"> Blueprint Viewer</span>
      </a>
    </div>

    <div class="card card-bordered bg-base-200 shadow-xl">
      <figure class="bg-base-100">
        <a
          class="flex h-64 w-full flex-col items-center justify-center"
          href="/blueprint/search"
          title="Browse blueprints"
        >
          <img class="size-32" src="/favicon.png" alt="Blueprint Icon" />
        </a>
      </figure>

      <div class="card-body">
        <h3 class="card-title">Browse blueprints</h3>
        <p>Search an infinite collection of community made blueprints.</p>
      </div>

      <a
        class="btn btn-primary no-animation btn-block rounded-t-none"
        href="/blueprint/search"
        title="Browse blueprints"
      >
        Start
        <span class="sr-only"> blueprint search </span>
      </a>
    </div>
  </div>
</section>

{#if data.searchBlueprints && data.searchBlueprints.length && data.blueprintImages}
  <section
    class="mx-auto mt-16 w-full max-w-5xl space-y-4 px-4 md:mb-8 md:mt-24 lg:px-0"
    id="latest"
  >
    <h2 class="text-3xl font-bold md:text-4xl">Latest blueprints</h2>

    <BlueprintItemList
      items={data.searchBlueprints.slice(0, 3)}
      images={data.blueprintImages}
    />

    <div class="flex justify-center">
      <Button.Root href="/blueprint/search">Show more</Button.Root>
    </div>
  </section>
{/if}
