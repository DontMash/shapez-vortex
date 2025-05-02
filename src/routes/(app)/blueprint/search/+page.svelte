<script lang="ts">
  import type { PageData } from './$types';
  import {
    Button,
    Collapsible,
    Combobox,
    Pagination,
    Select,
    type Selected,
  } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';
  import { superForm } from 'sveltekit-superforms';
  import {
    PAGINATION_PAGE_DEFAULT,
    PAGINATION_PER_PAGE_DEFAULT,
    SEARCH_ORDER_OPTIONS,
    SEARCH_SORT_OPTIONS,
  } from '$lib/search';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  export let data: PageData;

  let formElement: HTMLFormElement | undefined;
  const form = superForm(data.form);
  const { form: formData } = form;

  let filterTagOptions: Array<Selected<string>> | undefined;
  const sortOptions: Array<Selected<string>> = Object.entries(
    SEARCH_SORT_OPTIONS,
  ).map(([key, value]) => ({ label: value, value: key }));
  const orderOptions: Array<Selected<string>> = Object.entries(
    SEARCH_ORDER_OPTIONS,
  ).map(([key, value]) => ({ label: value, value: key }));

  $: {
    if (filterTagOptions) {
      $formData.filter = `tags=${filterTagOptions.map((tagOption) => tagOption.label).join(',')}`;
    }
  }

  onMount(() => {
    const filterTags = $formData.filter
      ?.split(';')
      .find((value) => value.startsWith('tags'))
      ?.split('=')[1]
      .split(',');
    if (filterTags) {
      filterTagOptions = data.tags
        .filter((tag) => filterTags.includes(tag.name))
        .map((tag) => ({ label: tag.name, value: tag.id }));
    }
  });
</script>

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--search] heading-2" />
    {data.seo.title}

    <svelte:fragment slot="description">
      {data.seo.description}
    </svelte:fragment>
  </PageHeader>

  <form class="flex flex-col gap-2" method="get" bind:this={formElement}>
    <div class="flex items-start gap-2">
      <Field {form} name="query" let:constraints>
        <div class="flex flex-1 flex-col gap-2">
          <Control let:attrs>
            <Label class={input.group()}>
              <span class="icon-[tabler--search]">Search</span>
              <input
                class={input.field()}
                type="text"
                placeholder="Search"
                {...attrs}
                {...constraints}
                bind:value={$formData.query}
              />
            </Label>
          </Control>
          <FieldErrors class="text-error" />
        </div>
      </Field>

      <Button.Root class={button({ intent: 'primary' })}>
        <span class="icon-[tabler--list-search]" />
        Apply
      </Button.Root>
    </div>

    <Collapsible.Root class="group mb-2 rounded-md border">
      <Collapsible.Trigger asChild let:builder>
        <Button.Root
          class="{button({
            intent: 'accent',
            kind: 'ghost',
          })} w-full justify-between gap-2 px-4 group-data-[state=open]:mb-2"
          builders={[builder]}
          type="button"
        >
          <div class="flex gap-2">
            <span class="icon-[tabler--filter]" />
            Filter
          </div>
          <span
            class="icon-[tabler--chevron-down] text-lg transition-transform group-data-[state=open]:-rotate-180"
          />
        </Button.Root>
      </Collapsible.Trigger>

      <Collapsible.Content
        class="flex flex-col gap-2 p-4"
        transition={slide}
        transitionConfig={{ duration: 150 }}
      >
        <Field {form} name="filter">
          <Control>
            <div class="flex flex-col gap-2">
              {#if filterTagOptions}
                <ul class="flex gap-2">
                  {#each filterTagOptions as tagSelected}
                    <li>
                      <span
                        class="inline-flex items-center gap-1 rounded-xs border pl-2"
                      >
                        #{tagSelected.label}

                        <Button.Root
                          class={button({
                            intent: 'error',
                            kind: 'ghost',
                            size: 'icon-sm',
                          })}
                          type="button"
                          on:click={() => {
                            filterTagOptions = filterTagOptions?.filter(
                              (tag) => tag.value !== tagSelected.value,
                            );
                          }}
                        >
                          <span class="icon-[tabler--x]"
                            >Remove tag {tagSelected.label}</span
                          >
                        </Button.Root>
                      </span>
                    </li>
                  {/each}
                </ul>
              {/if}
              <Combobox.Root
                multiple
                items={data.tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                preventScroll={false}
                bind:selected={filterTagOptions}
              >
                <label class={input.group()} for="blueprint-tag-input">
                  <span class="icon-[tabler--tags]" />
                  <Combobox.Input
                    class={input.field()}
                    id="blueprint-tag-input"
                    placeholder="Select tags"
                    aria-label="Select tags"
                  />
                </label>

                <Combobox.Content
                  class="max-h-64 overflow-y-auto rounded-md border bg-layer p-2"
                  sideOffset={20}
                  sameWidth
                >
                  {#each data.tags as tag}
                    <Combobox.Item
                      class="flex cursor-pointer justify-between gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                      value={tag.id}
                      label={tag.name}
                    >
                      #{tag.name}
                      <Combobox.ItemIndicator>
                        <span class="icon-[tabler--check]">selected</span>
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  {/each}
                </Combobox.Content>
              </Combobox.Root>
            </div>
          </Control>
          <FieldErrors class="text-error" />
        </Field>
      </Collapsible.Content>
    </Collapsible.Root>

    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <Field {form} name="sort" let:constraints>
        <div class="flex flex-1 flex-col gap-2">
          <Control let:attrs>
            <Label>
              <Select.Root
                name={attrs.name}
                items={sortOptions}
                loop
                selected={sortOptions.find(
                  (sort) => sort.value === $formData.sort,
                )}
                onSelectedChange={() =>
                  tick().then(() => formElement?.requestSubmit())}
                {...constraints}
              >
                <Select.Trigger
                  class="{button({
                    kind: 'outline',
                    intent: 'muted',
                  })} w-full min-w-64 bg-background"
                  {...attrs}
                  {...constraints}
                >
                  <span class="icon-[tabler--arrows-sort]" />
                  <Select.Value placeholder="Sort by" />
                  <span class="icon-[tabler--caret-up-down] ml-auto" />
                </Select.Trigger>

                <Select.Input name="sort" bind:value={$formData.sort} />

                <Select.Content
                  class="z-10 flex flex-col rounded-sm border bg-background p-2 shadow-lg"
                >
                  {#each sortOptions as { label, value }}
                    <Select.Item
                      class="{button({
                        kind: 'ghost',
                        intent: 'muted',
                        size: 'sm',
                      })} data-[highlighted]:bg-muted"
                      {label}
                      {value}
                    >
                      {label}
                      <Select.ItemIndicator class="ml-auto flex items-center">
                        <span class="icon-[tabler--check]">Selected</span>
                      </Select.ItemIndicator>
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </Label>
          </Control>
          <FieldErrors class="text-error" />
        </div>
      </Field>

      <Field {form} name="order" let:constraints>
        <div class="flex flex-1 flex-col gap-2">
          <Control let:attrs>
            <Label>
              <Select.Root
                name={attrs.name}
                items={orderOptions}
                loop
                selected={orderOptions.find(
                  (order) => order.value === $formData.order,
                )}
                onSelectedChange={() =>
                  tick().then(() => formElement?.requestSubmit())}
                {...constraints}
              >
                <Select.Trigger
                  class="{button({
                    kind: 'outline',
                    intent: 'muted',
                  })} w-full min-w-64 bg-background"
                  {...attrs}
                  {...constraints}
                >
                  <span class="icon-[tabler--menu-order]" />
                  <Select.Value placeholder="Order by" />
                  <span class="icon-[tabler--caret-up-down] ml-auto" />
                </Select.Trigger>

                <Select.Input name="order" bind:value={$formData.order} />

                <Select.Content
                  class="z-10 flex flex-col rounded-sm border bg-background p-2 shadow-lg"
                >
                  {#each orderOptions as { label, value }}
                    <Select.Item
                      class="{button({
                        kind: 'ghost',
                        intent: 'muted',
                        size: 'sm',
                      })} data-[highlighted]:bg-muted"
                      {label}
                      {value}
                    >
                      {label}
                      <Select.ItemIndicator class="ml-auto flex items-center">
                        <span class="icon-[tabler--check]">Selected</span>
                      </Select.ItemIndicator>
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </Label>
          </Control>
          <FieldErrors class="text-error" />
        </div>
      </Field>
    </div>

    <input type="hidden" name="filter" bind:value={$formData.filter} />
    {#if $formData.page !== PAGINATION_PAGE_DEFAULT}
      <input type="hidden" name="page" bind:value={$formData.page} />
    {/if}
    {#if $formData.perPage !== PAGINATION_PER_PAGE_DEFAULT}
      <input type="hidden" name="perPage" bind:value={$formData.perPage} />
    {/if}
  </form>

  {#if data.result.items && data.result.items.length > 0}
    <Pagination.Root
      class="flex items-center justify-center gap-2 py-4"
      count={data.result.totalItems}
      perPage={data.result.perPage}
      onPageChange={() => tick().then(() => formElement?.requestSubmit())}
      bind:page={$formData.page}
      let:pages
    >
      <Pagination.PrevButton
        class={button({
          kind: 'ghost',
          intent: 'accent',
          size: 'icon',
        })}
      >
        <span class="icon-[tabler--chevron-left]" />
      </Pagination.PrevButton>

      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <div class="font-medium">...</div>
        {:else}
          <Pagination.Page
            {page}
            class="{button({
              kind: 'ghost',
              intent: 'accent',
              size: 'icon',
            })} data-[selected]:bg-accent data-[selected]:text-accent-foreground"
          >
            {page.value}
          </Pagination.Page>
        {/if}
      {/each}

      <Pagination.NextButton
        class={button({
          kind: 'ghost',
          intent: 'accent',
          size: 'icon',
        })}
      >
        <span class="icon-[tabler--chevron-right]" />
      </Pagination.NextButton>
    </Pagination.Root>

    <BlueprintItemList items={data.result.items} images={data.images} />

    <Pagination.Root
      class="flex items-center justify-center gap-2 py-4"
      count={data.result.totalItems}
      perPage={data.result.perPage}
      onPageChange={() => tick().then(() => formElement?.requestSubmit())}
      bind:page={$formData.page}
      let:pages
    >
      <Pagination.PrevButton
        class={button({
          kind: 'ghost',
          intent: 'accent',
          size: 'icon',
        })}
      >
        <span class="icon-[tabler--chevron-left]" />
      </Pagination.PrevButton>

      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <div class="font-medium">...</div>
        {:else}
          <Pagination.Page
            {page}
            class="{button({
              kind: 'ghost',
              intent: 'accent',
              size: 'icon',
            })} data-[selected]:bg-accent data-[selected]:text-accent-foreground"
          >
            {page.value}
          </Pagination.Page>
        {/if}
      {/each}

      <Pagination.NextButton
        class={button({
          kind: 'ghost',
          intent: 'accent',
          size: 'icon',
        })}
      >
        <span class="icon-[tabler--chevron-right]" />
      </Pagination.NextButton>
    </Pagination.Root>
  {:else}
    <div class="flex items-center justify-center">
      <span>No blueprints found</span>
    </div>
  {/if}
</section>
