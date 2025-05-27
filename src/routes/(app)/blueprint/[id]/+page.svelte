<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from 'bits-ui';
  import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
  import { copy } from '$lib/client/actions/clipboard.svelte';
  import { add } from '$lib/client/toast.service';

  import BlueprintInteraction from '$lib/components/blueprint/BlueprintInteraction.svelte';
  import BlueprintTag from '$lib/components/blueprint/BlueprintTag.svelte';
  import { button } from '$lib/components/button';
  import { section } from '$lib/components/section';
  import UserTag from '$lib/components/UserTag.svelte';

  let { data }: PageProps = $props();

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  });

  type Property = {
    iconClass: string;
    title: string;
    value: string | number;
    unit: string;
  };
  const properties: Array<Array<Property>> = [
    [
      {
        iconClass: 'icon-[tabler--square-rounded-letter-t] text-primary',
        title: 'Blueprint type',
        value: data.blueprint.entry.type,
        unit: 'type',
      },
      {
        iconClass: 'icon-[tabler--currency-bitcoin] text-secondary',
        title: 'Blueprint cost',
        value: data.blueprint.entry.cost,
        unit: 'points',
      },
    ],
    [
      {
        iconClass: 'icon-[tabler--schema]',
        title: 'Building count',
        value: data.blueprint.entry.buildingCount,
        unit: data.blueprint.entry.buildingCount > 1 ? 'buildings' : 'building',
      },
      {
        iconClass: 'icon-[tabler--apps]',
        title: 'Island count',
        value: data.blueprint.entry.islandCount || '-',
        unit: data.blueprint.entry.islandCount > 1 ? 'islands' : 'island',
      },
    ],
    [
      {
        iconClass: 'icon-[tabler--eye]',
        title: 'View count',
        value: data.blueprint.entry.viewCount || '-',
        unit: data.blueprint.entry.viewCount > 1 ? 'views' : 'view',
      },
      {
        iconClass: 'icon-[tabler--download]',
        title: 'Download count',
        value: data.blueprint.entry.downloadCount || '-',
        unit: data.blueprint.entry.downloadCount > 1 ? 'downloads' : 'download',
      },
      {
        iconClass: 'icon-[tabler--bookmark-filled]',
        title: 'Bookmark count',
        value: data.blueprint.entry.bookmarkCount || '-',
        unit:
          data.blueprint.entry.bookmarkCount > 1 ? 'bookmarks' : 'bookmarks',
      },
    ],
  ];

  let slider: {
    root?: HTMLElement | undefined;
    api?: EmblaCarouselType | undefined;
  } = $state({});

  $effect(() => {
    if (!slider.root || slider.api) {
      return;
    }

    slider.api = EmblaCarousel(slider.root, { loop: true });
  });
</script>

<section class={section()}>
  <article class="divide-y rounded-lg border">
    <header class="space-y-4 p-4">
      <div class="flex flex-wrap items-start gap-2">
        {#if data.blueprint.entry.expand && data.blueprint.entry.expand['creator']}
          <UserTag name={data.blueprint.entry.expand['creator'].displayname} />
        {/if}

        <span
          class="small bg-muted inline-flex items-center gap-1 rounded-xs px-1 py-0.5"
        >
          <span class="icon-[tabler--info-circle] text-lg"
            >Blueprint version</span
          >
          v{data.blueprint.entry.version}
        </span>
        <span
          class="small bg-muted inline-flex items-center gap-1 rounded-xs px-1 py-0.5"
        >
          <span class="icon-[tabler--clock-edit] text-lg">Created on</span>
          {dateFormatter.format(new Date(data.blueprint.entry.created))}
        </span>

        <div class="ml-auto flex items-center gap-4">
          <BlueprintInteraction
            user={data.blueprint.user}
            blueprint={data.blueprint.entry}
            reportForm={data.form}
          />
        </div>
      </div>

      <h1 class="heading-2 break-words">
        {data.blueprint.entry.title}
      </h1>
    </header>

    {#if data.blueprint.images.length}
      <section>
        <h2 class="sr-only">Images</h2>

        <div class="relative">
          <div class="embla__viewport overflow-hidden" bind:this={slider.root}>
            <div class="embla__container flex">
              {#each data.blueprint.images as image, index (index)}
                <div class="embla__slide relative min-w-full">
                  <img
                    class="aspect-[3/2] object-cover"
                    src={image.src}
                    alt="Image #{index} of {data.blueprint.entry.title}"
                  />

                  <Button.Root
                    class="{button({
                      intent: 'accent',
                      size: 'icon-sm',
                    })} absolute top-4 right-4"
                    title="Zoom image"
                    href={image.src}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span class="icon-[tabler--window-maximize]">
                      Open in new Tab
                    </span>
                  </Button.Root>
                </div>
              {/each}
            </div>
          </div>

          {#if data.blueprint.images.length > 1}
            <button
              class="{button({
                intent: 'accent',
                size: 'icon-sm',
              })} absolute top-1/2 left-4 -translate-y-1/2 shadow-lg"
              onclick={() => {
                slider.api?.scrollPrev();
              }}
            >
              <span class="icon-[tabler--chevron-left]"> Prev </span>
            </button>
            <button
              class="{button({
                intent: 'accent',
                size: 'icon-sm',
              })} absolute top-1/2 right-4 -translate-y-1/2 shadow-lg"
              onclick={() => slider.api?.scrollNext()}
            >
              <span class="icon-[tabler--chevron-right]"> Next </span>
            </button>
          {/if}
        </div>
      </section>
    {/if}

    <section class="flex flex-col gap-4 p-4">
      <h2 class="sr-only">Description</h2>

      {#if data.blueprint.entry.expand && data.blueprint.entry.expand['tags']}
        {@const tags = data.blueprint.entry.expand['tags']}
        <ul>
          {#each tags as tag (tag.id)}
            <li class="inline">
              <BlueprintTag data={tag} />
            </li>
          {/each}
        </ul>
      {/if}

      <div class="prose min-h-32 grow">{data.blueprint.entry.description}</div>

      <ul class="flex flex-col gap-2 sm:flex-row">
        <li>
          <Button.Root
            class="{button()} w-full sm:w-auto"
            title="View blueprint"
            href={`/blueprint/${data.blueprint.entry.id}/view`}
          >
            <span class="icon-[tabler--eye]"></span>
            View
          </Button.Root>
        </li>
        <li>
          <Button.Root
            class="{button({ intent: 'secondary' })} w-full sm:w-auto"
            title="Download blueprint"
            href="/api/v1/blueprint/{data.blueprint.entry.id}/download"
            download
          >
            <span class="icon-[tabler--download]"></span>
            Download
          </Button.Root>
        </li>
        <li>
          <button
            class="{button({ intent: 'accent' })} w-full sm:w-auto"
            title="Copy blueprint"
            {@attach copy({
              value: data.blueprint.entry.data,
              oncopy: () => add({ message: 'Content copied' }),
              onerror: (error) =>
                add({ message: error.message, type: 'ERROR' }),
            })}
          >
            <span class="icon-[tabler--copy]"></span>
            Copy
          </button>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="sr-only">Properties</h2>

      <div class="flex flex-wrap justify-between gap-4 p-4">
        {#each properties as category, categoryIndex (categoryIndex)}
          <ul class="space-y-2">
            {#each category as property (property.title)}
              <li class="flex items-center gap-2">
                <span class={property.iconClass}>{property.title}</span>
                <p>
                  {property.value}
                  <span class="small text-muted-foreground"
                    >{property.unit}</span
                  >
                </p>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    </section>
  </article>
</section>
