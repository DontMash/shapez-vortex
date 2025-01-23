<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from 'bits-ui';
  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import { section } from '$lib/components/section';
  import { button } from '$lib/components/button';

  import shapeViewerImage from '$lib/assets/images/shape-viewer-example.png';
  import blueprintViewerImage from '$lib/assets/images/blueprint-viewer-example.png';
  import searchImage from '$lib/assets/images/search-example.jpg';

  type Feature = {
    image: {
      src: string;
      alt: string;
    };
    title: string;
    description: string;
    url: string;
  };
  const features: Array<Feature> = [
    {
      image: {
        src: shapeViewerImage,
        alt: 'Example of a 3D shape view',
      },
      title: 'Shape Viewer',
      description:
        'Explore multiple layers and parts of a 3D visualization of a shape.',
      url: '/shape',
    },
    {
      image: {
        src: blueprintViewerImage,
        alt: 'Example of a 3D blueprint',
      },
      title: 'Blueprint Viewer',
      description: 'View your blueprints in 3D and share them with others.',
      url: '/blueprint',
    },
    {
      image: {
        src: searchImage,
        alt: 'Void of the Shapez universe',
      },
      title: 'Browse blueprints',
      description:
        'Search a near infinite collection of community made blueprints.',
      url: '/blueprint/search',
    },
  ];

  export let data: PageData;
</script>

<section class={section()} id="hero">
  <div class="rounded-lg border bg-layer px-4 py-12 shadow-lg sm:px-12">
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

<section class={section()} id="features">
  <h2 class="heading-2">Features</h2>

  <div class="mx-auto mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
    {#each features as feature}
      <div class="overflow-hidden rounded-md border bg-layer shadow-md">
        <a
          class="aspect-h-2 aspect-w-3 inline-block w-full"
          href={feature.url}
          title="Start {feature.title}"
        >
          <img
            class="object-contain lg:object-cover"
            src={feature.image.src}
            alt={feature.image.alt}
          />
        </a>

        <div class="flex flex-col p-4 lg:h-56">
          <h3 class="heading-3">{feature.title}</h3>
          <p class="mt-2">
            {feature.description}
          </p>

          <Button.Root
            class="{button({ block: true })} mt-8 lg:mt-auto"
            href={feature.url}
            title="Start {feature.title}"
          >
            Start
            <span class="sr-only">{feature.title}</span>
          </Button.Root>
        </div>
      </div>
    {/each}
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
