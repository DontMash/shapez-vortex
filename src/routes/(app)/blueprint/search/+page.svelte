<script lang="ts">
  import type { PageProps } from './$types';
  import {
    Button,
    Collapsible,
    Combobox,
    Pagination,
    Select,
    Toggle,
  } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { tick, untrack } from 'svelte';
  import { slide } from 'svelte/transition';
  import { superForm } from 'sveltekit-superforms';
  import {
    PAGINATION_PAGE_DEFAULT,
    PAGINATION_PER_PAGE_DEFAULT,
    SEARCH_ORDER_OPTION_DEFAULT,
    SEARCH_ORDER_OPTIONS,
    SEARCH_SORT_OPTIONS,
  } from '$lib/search';

  import { button } from '$lib/components/button';
  import * as input from '$lib/components/input';
  import { section } from '$lib/components/section';

  import BlueprintItemList from '$lib/components/blueprint/BlueprintItemList.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import type { BlueprintTag } from '$lib/blueprint.types';

  let { data }: PageProps = $props();

  let formElement: HTMLFormElement | undefined = $state();
  const form = superForm(data.form);
  const { form: formData } = form;

  let isFilterOpen: boolean = $state(false);
  let filterTagNames: Array<string> | undefined = $state();
  let filterTagOptions: Array<string> | undefined = $state();
  let filterTags: Array<BlueprintTag> | undefined = $derived(
    filterTagOptions
      ?.map((value) => data.tags.find((tag) => tag.id === value))
      .filter((value) => !!value),
  );
  const sortOptions: Array<{ label: string; value: string }> = Object.entries(
    SEARCH_SORT_OPTIONS,
  ).map(([key, value]) => ({ label: value, value: key }));
  const orderOptions: Array<{ label: string; value: string }> = Object.entries(
    SEARCH_ORDER_OPTIONS,
  ).map(([key, value]) => ({ label: value, value: key }));

  $effect(() => {
    if (!data.tags) {
      return;
    }
    untrack(() => {
      filterTagNames = getFilterTagNames($formData.filter);
    });
  });

  $effect(() => {
    filterTagOptions = data.tags
      .filter((tag) => filterTagNames?.includes(tag.name))
      .map((tag) => tag.id);
  });

  $effect(() => {
    if (!filterTagOptions) {
      return;
    }
    $formData.filter = `tags=${filterTagOptions.map((tagOption) => data.tags.find((tag) => tag.id === tagOption)?.name).join(',')}`;
  });

  const getFilterTagNames = (
    filterParam?: string,
  ): Array<string> | undefined => {
    return filterParam
      ?.split(';')
      .find((value) => value.startsWith('tags'))
      ?.split('=')[1]
      .split(',');
  };
</script>

{#snippet pagination()}
  <Pagination.Root
    class="flex items-center justify-center gap-2 py-4"
    count={data.result.totalItems}
    perPage={data.result.perPage}
    onPageChange={() => tick().then(() => formElement?.requestSubmit())}
    bind:page={$formData.page}
  >
    {#snippet children({ pages })}
      <Pagination.PrevButton
        class={button({
          kind: 'ghost',
          intent: 'accent',
          size: 'icon',
        })}
      >
        <span class="icon-[tabler--chevron-left]"></span>
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
        <span class="icon-[tabler--chevron-right]"></span>
      </Pagination.NextButton>
    {/snippet}
  </Pagination.Root>
{/snippet}

<section class={section()}>
  <PageHeader>
    <span class="icon-[tabler--search] heading-2"></span>
    {data.seo.title}

    {#snippet description()}
      {data.seo.description}
    {/snippet}
  </PageHeader>

  <form
    class="flex flex-col gap-2"
    method="get"
    onsubmit={(event) => {
      event.preventDefault();

      if ($formData.page === data.form.data.page) {
        $formData.page = 1;
      }

      const form = event.currentTarget;
      tick().then(() => form.submit());
    }}
    bind:this={formElement}
  >
    <div class="flex items-start gap-2">
      <Field {form} name="query">
        {#snippet children({ constraints })}
          <div class="flex flex-1 flex-col gap-2">
            <Control>
              {#snippet children({ props })}
                <Label class={input.group()}>
                  <span class="icon-[tabler--search]">Search</span>
                  <input
                    class={input.field()}
                    type="text"
                    placeholder="Search"
                    {...props}
                    {...constraints}
                    bind:value={$formData.query}
                  />
                </Label>
              {/snippet}
            </Control>
            <FieldErrors class="text-error" />
          </div>
        {/snippet}
      </Field>

      <Button.Root class={button({ intent: 'primary' })}>
        <span class="icon-[tabler--list-search]"></span>
        Apply
      </Button.Root>
    </div>

    <Collapsible.Root
      class="group mb-2 rounded-md border"
      bind:open={isFilterOpen}
    >
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Button.Root
            class="{button({
              intent: 'accent',
              kind: 'ghost',
            })} w-full justify-between gap-2 px-4 group-data-[state=open]:mb-2"
            type="button"
            {...props}
          >
            <div class="flex gap-2">
              <span class="icon-[tabler--filter]"></span>
              Filter
            </div>
            <span
              class="icon-[tabler--chevron-down] text-lg transition-transform group-data-[state=open]:-rotate-180"
            ></span>
          </Button.Root>
        {/snippet}
      </Collapsible.Trigger>

      <Collapsible.Content class="flex flex-col gap-2 p-4" forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:slide={{ duration: 150 }}>
              {#if filterTags}
                <div class="flex flex-col gap-2">
                  <ul class="flex flex-wrap gap-2">
                    {#each filterTags as tag (tag.id)}
                      <li>
                        <span
                          class="inline-flex items-center gap-1 rounded-xs border pl-2"
                        >
                          #{tag.name}

                          <Button.Root
                            class={button({
                              intent: 'error',
                              kind: 'ghost',
                              size: 'icon-sm',
                            })}
                            type="button"
                            onclick={() => {
                              filterTagOptions = filterTagOptions?.filter(
                                (tagOption) => tagOption !== tag.id,
                              );
                            }}
                          >
                            <span class="icon-[tabler--x]"
                              >Remove tag {tag}</span
                            >
                          </Button.Root>
                        </span>
                      </li>
                    {/each}
                  </ul>
                  <Combobox.Root
                    type="multiple"
                    items={data.tags.map((tag) => ({
                      value: tag.id,
                      label: tag.name,
                    }))}
                    bind:value={filterTagOptions}
                  >
                    <label class={input.group()} for="blueprint-tag-input">
                      <span class="icon-[tabler--tags]"></span>
                      <Combobox.Input
                        class={input.field()}
                        id="blueprint-tag-input"
                        placeholder="Select tags"
                        aria-label="Select tags"
                      />
                    </label>

                    <Combobox.Content
                      class="relative z-10 max-h-64 overflow-y-auto rounded-md border bg-layer p-2"
                      sideOffset={20}
                    >
                      {#each data.tags as tag (tag.id)}
                        <Combobox.Item
                          class="flex cursor-pointer justify-between gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                          value={tag.id}
                          label={tag.name}
                        >
                          {#snippet children({ selected })}
                            #{tag.name}

                            {#if selected}
                              <span class="icon-[tabler--check]">selected</span>
                            {/if}
                          {/snippet}
                        </Combobox.Item>
                      {/each}
                    </Combobox.Content>
                  </Combobox.Root>
                </div>
              {/if}
            </div>
          {/if}
        {/snippet}
      </Collapsible.Content>
    </Collapsible.Root>

    <div class="flex gap-2">
      <Field {form} name="sort">
        {#snippet children({ constraints })}
          <div class="flex flex-1 flex-col gap-2">
            <Control>
              {#snippet children({ props })}
                <Label>
                  <Select.Root
                    type="single"
                    name={props.name}
                    items={sortOptions}
                    loop
                    bind:value={$formData.sort}
                    onValueChange={() =>
                      tick().then(() => formElement?.requestSubmit())}
                    {...constraints}
                  >
                    <Select.Trigger
                      class="{button({
                        kind: 'outline',
                        intent: 'accent',
                      })} w-full min-w-64 bg-background"
                      {...props}
                      {...constraints}
                    >
                      <span class="icon-[tabler--arrows-sort]"></span>
                      {SEARCH_SORT_OPTIONS[$formData.sort] ?? 'Sort by'}
                      <span class="icon-[tabler--caret-up-down] ml-auto"></span>
                    </Select.Trigger>

                    <Select.Content
                      class="z-10 flex flex-col rounded-sm border bg-background p-2 shadow-lg"
                    >
                      {#each sortOptions as { label, value } (value)}
                        <Select.Item
                          class="{button({
                            kind: 'ghost',
                            intent: 'muted',
                            size: 'sm',
                          })} data-[highlighted]:bg-muted"
                          {label}
                          {value}
                        >
                          {#snippet children({ selected })}
                            {label}

                            {#if selected}
                              <div class="ml-auto flex items-center">
                                <span class="icon-[tabler--check]"
                                  >selected</span
                                >
                              </div>
                            {/if}
                          {/snippet}
                        </Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </Label>
              {/snippet}
            </Control>
            <FieldErrors class="text-error" />
          </div>
        {/snippet}
      </Field>

      <Field {form} name="order">
        {#snippet children({ constraints })}
          <div class="flex flex-col gap-2">
            <Control>
              {#snippet children({ props })}
                <Toggle.Root
                  class={button({
                    kind: 'outline',
                    intent: 'muted',
                    size: 'icon',
                  })}
                  title="Order by {$formData.order ===
                  SEARCH_ORDER_OPTION_DEFAULT
                    ? 'descending'
                    : 'ascending'}"
                  {...props}
                  {...constraints}
                  name="order-toggle"
                  bind:pressed={
                    () => $formData.order === SEARCH_ORDER_OPTION_DEFAULT,
                    (state) => ($formData.order = state ? 'desc' : 'asc')
                  }
                  onPressedChange={() =>
                    tick().then(() => formElement?.requestSubmit())}
                >
                  {#if $formData.order === SEARCH_ORDER_OPTION_DEFAULT}
                    <span class="icon-[tabler--arrow-narrow-down]"
                      >Descending</span
                    >
                  {:else}
                    <span class="icon-[tabler--arrow-narrow-up]">Ascending</span
                    >
                  {/if}
                </Toggle.Root>
              {/snippet}
            </Control>
            <FieldErrors class="text-error" />
          </div>
        {/snippet}
      </Field>
    </div>

    <Field {form} name="filter">
      {#snippet children({ constraints })}
        <Control>
          {#snippet children({ props })}
            <input
              type="hidden"
              {...props}
              {...constraints}
              bind:value={$formData.filter}
            />
          {/snippet}
        </Control>
        <FieldErrors class="text-error" />
      {/snippet}
    </Field>

    {#if $formData.order !== SEARCH_ORDER_OPTION_DEFAULT}
      <input type="hidden" name="order" bind:value={$formData.order} />
    {/if}
    {#if $formData.page !== PAGINATION_PAGE_DEFAULT}
      <input type="hidden" name="page" bind:value={$formData.page} />
    {/if}
    {#if $formData.perPage !== PAGINATION_PER_PAGE_DEFAULT}
      <input type="hidden" name="perPage" bind:value={$formData.perPage} />
    {/if}
  </form>

  {#if data.result.items && data.result.items.length > 0}
    {@render pagination()}

    <BlueprintItemList items={data.result.items} images={data.images} />

    {@render pagination()}
  {:else}
    <div class="flex items-center justify-center py-4">
      <span>No blueprints found</span>
    </div>
  {/if}
</section>
