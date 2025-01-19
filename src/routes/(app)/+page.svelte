<script lang="ts">
  import type { PageData } from './$types';

  import { Button } from '$lib/components/ui/button';
  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';

  export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl px-4 md:mt-8 lg:px-0" id="hero">
  <div class="hero rounded-lg bg-base-200 p-8 md:p-12">
    <div class="hero-content text-center">
      <div class="max-w-lg">
        <h2 class="text-4xl font-bold md:text-5xl">Shapez Vortex</h2>
        <p class="py-6 text-2xl md:text-3xl">
          Discover, interact and share Shapez 2 content with the community!
        </p>
        <ul class="flex justify-center space-x-4">
          <li>
            <a
              class="btn btn-primary"
              title={data.user ? 'Upload blueprint' : 'Create an account'}
              href={data.user ? '/blueprint/upload' : '/register'}
              >Get Started</a
            >
          </li>
          <li>
            <a class="btn btn-secondary" href="#features">Features</a>
          </li>
        </ul>
      </div>
    </div>
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
      <Button href="/blueprint/search" size="lg" variant="outline"
        >Show more</Button
      >
    </div>
  </section>
{/if}
