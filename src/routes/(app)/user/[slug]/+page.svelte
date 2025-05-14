<script lang="ts">
  import type { PageProps } from './$types';
  import { Button } from 'bits-ui';

  import PageHeader from '$lib/components/PageHeader.svelte';
  import { section } from '$lib/components/section';

  import blueprintImage from '$lib/assets/images/blueprint-library.png';
  import bookmarkImage from '$lib/assets/images/folder.png';

  let { data }: PageProps = $props();

  type ProfileFeature = {
    image: {
      src: string;
      alt: string;
    };
    title: string;
    description: string;
    url: string;
    tooltip: string;
  };
  const features: Array<ProfileFeature> = [
    {
      image: {
        src: bookmarkImage,
        alt: 'Blueprint library',
      },
      title: 'Blueprints',
      description:
        data.profile.id === data.user?.id
          ? 'View your uploaded blueprints.'
          : `View the blueprints of @${data.profile.displayname}.`,
      url: `/user/@${data.profile.displayname}/blueprints`,
      tooltip: 'View blueprints',
    },
    {
      image: {
        src: blueprintImage,
        alt: 'Bookmark library',
      },
      title: 'Bookmarks',
      description:
        data.profile.id === data.user?.id
          ? 'View your bookmarked blueprints.'
          : `View the bookmarked blueprints of @${data.profile.displayname}.`,
      url: `/user/@${data.profile.displayname}/bookmarks`,
      tooltip: 'View bookmarks',
    },
  ];
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--user] heading-2">User</span>
    {data.profile.displayname}
  </PageHeader>

  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each features as feature (feature.url)}
      <li>
        <Button.Root
          class="inline-block h-full w-full overflow-hidden rounded-md border bg-layer shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          href={feature.url}
          title={feature.tooltip}
        >
          <div class="aspect-h-2 aspect-w-3 border-b">
            <img
              class="object-contain lg:object-cover"
              src={feature.image.src}
              alt={feature.image.alt}
            />
          </div>

          <div class="p-4">
            <h2 class="heading-3">{feature.title}</h2>
            <p class="mt-2">{feature.description}</p>
          </div>
        </Button.Root>
      </li>
    {/each}
  </ul>
</section>
