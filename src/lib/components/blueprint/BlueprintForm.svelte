<script lang="ts">
  import {
    AlertDialog,
    Button,
    Checkbox,
    Collapsible,
    Combobox,
    Tooltip,
  } from 'bits-ui';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import {
    arrayProxy,
    filesProxy,
    superForm,
    type SuperValidated,
  } from 'sveltekit-superforms';
  import { z } from 'zod';
  import { beforeNavigate, goto } from '$app/navigation';
  import { toBlob, toFileList } from '$lib/utils';
  import { add } from '$lib/client/toast.service';
  import { decode, isBlueprintIdentifier } from '$lib/blueprint';
  import {
    BLUEPRINT_DESCRIPTION_MAX_LENGTH,
    BLUEPRINT_FORM_SCHEMA,
    BLUEPRINT_IMAGE_MAX_FILE_SIZE,
    BLUEPRINT_IMAGE_TYPES,
    BLUEPRINT_IMAGES_MAX,
    BLUEPRINT_TAG_NEW_SYMBOL,
    BLUEPRINT_TAG_REGEX,
    BLUEPRINT_TAGS_MAX,
    BLUEPRINT_TITLE_MAX_LENGTH,
    BLUEPRINT_TITLE_MIN_LENGTH,
  } from '$lib/blueprint.schema';
  import {
    BLUEPRINT_FILE_FORMAT,
    type Blueprint,
    type BlueprintRecordData,
    type BlueprintTag,
  } from '$lib/blueprint.types';

  import { button } from '$lib/components/button';
  import * as dialog from '$lib/components/dialog';
  import * as input from '$lib/components/input';

  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

  interface Props {
    data: {
      form: SuperValidated<z.infer<typeof BLUEPRINT_FORM_SCHEMA>>;
      type: 'create' | 'update';
      tags: Array<BlueprintTag>;
      record?: BlueprintRecordData;
      images?: Array<{ src: string }>;
    };
  }

  let { data }: Props = $props();

  const form = superForm(data.form);

  const { form: formData, enhance, submit, tainted } = form;
  const images = filesProxy(form, 'images');
  const { valueErrors: imageErrors } = arrayProxy(form, 'images');

  let isSubmit = false;
  let leaveUrl: URL | undefined = $state();

  let blueprintImagesFileInput: HTMLInputElement | undefined = $state();
  let blueprintTagInputValue: string = $state('');
  let blueprintView: BlueprintView | undefined = $state();

  let blueprint: Blueprint | undefined = $state();
  let blueprintPreview: boolean = $state(data.type === 'create');
  const tags: Array<BlueprintTag> = $derived(
    blueprintTagInputValue
      ? data.tags?.filter((tag: BlueprintTag) =>
          tag.name.includes(blueprintTagInputValue.toLowerCase()),
        )
      : data.tags,
  );

  $effect(() => {
    try {
      blueprint =
        blueprintPreview &&
        $formData.data &&
        isBlueprintIdentifier($formData.data)
          ? decode($formData.data)
          : undefined;
    } catch {
      blueprint = undefined;
      add({ message: 'Invalid blueprint identifier', type: 'ERROR' });
    }

    if (blueprintImagesFileInput) {
      blueprintImagesFileInput.files = $images;
    }
  });

  async function onSubmit(event: Event) {
    event.preventDefault();

    isSubmit = true;
    submit();
  }

  beforeNavigate((navigation) => {
    if (!$tainted || isSubmit || leaveUrl) {
      isSubmit = false;
      return;
    }

    navigation.cancel();

    leaveUrl = navigation.to?.url;
  });
  onMount(async () => {
    const { record, images, tags } = data;
    if (!record) {
      return;
    }

    $formData.title = record.title;
    $formData.data = record.data;
    $formData.description = record.description;

    if (images) {
      const promises = images.map<Promise<File>>(
        (image, index) =>
          new Promise<File>((resolve, reject) => {
            fetch(image.src)
              .then((response) => response.blob())
              .then((blob) =>
                resolve(
                  new File([blob], `${data.images?.at(index)}`, {
                    type: blob.type,
                  }),
                ),
              )
              .catch(reject);
          }),
      );
      const files = await Promise.all(promises);
      $formData.images = files;
    }

    if (tags) {
      $formData.tags = tags
        .filter((tag) => record.tags.includes(tag.id))
        .map<string>((tag) => tag.id);
    }
  });
</script>

<form
  class="flex flex-col gap-2"
  method="post"
  enctype="multipart/form-data"
  use:enhance
>
  <label
    class="{input.group({ type: 'file' })} relative mb-2 block h-32"
    for="blueprint-file"
  >
    <input
      class="{input.field()} cursor-pointer [text-indent:-9999rem]"
      type="file"
      id="blueprint-file"
      accept={BLUEPRINT_FILE_FORMAT}
      multiple
      onchange={async (event) => {
        const input = event.currentTarget;
        const files = input.files;
        if (!files || files.length <= 0) return;

        const file = files.item(0);
        if (!file) return;

        const buffer = await file.arrayBuffer();
        const codec = new TextDecoder();
        const identifier = codec.decode(buffer);
        if (!isBlueprintIdentifier(identifier)) {
          return add({
            message: 'Invalid blueprint file',
            type: 'ERROR',
          });
        }

        if (!$formData.title)
          $formData.title = file.name.slice(0, -BLUEPRINT_FILE_FORMAT.length);
        $formData.data = identifier;

        input.files = null;
        add({ message: 'Updated blueprint fields', type: 'SUCCESS' });
      }}
    />
    <div class="absolute inset-0 flex items-center justify-center">
      <div>
        <span class="icon-[tabler--file-upload] size-8 align-middle"></span>
        <span>Blueprint file</span>
      </div>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            class="{button({
              kind: 'ghost',
              intent: 'muted',
              size: 'icon-sm',
            })} absolute right-4 top-3"
          >
            <span class="icon-[tabler--info-circle]"></span>
          </Tooltip.Trigger>
          <Tooltip.Content
            class="max-w-60 rounded-md border bg-layer p-2 text-layer-foreground"
          >
            <p>
              The name and content of the file will be added to the fields
              above.
            </p>
            <p>(If there already is a title present, it wont be replaced)</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </label>

  <Field {form} name="title">
    {#snippet children({ constraints })}
      <Control>
        {#snippet children({ props })}
          <Label class={input.group()}>
            <span class="icon-[tabler--abc]">Title</span>
            <input
              class={input.field()}
              type="text"
              placeholder="Title"
              {...props}
              {...constraints}
              bind:value={$formData.title}
            />
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  class={button({
                    kind: 'ghost',
                    intent: 'muted',
                    size: 'icon-sm',
                  })}
                >
                  <span class="icon-[tabler--info-circle]"></span>
                </Tooltip.Trigger>
                <Tooltip.Content
                  class="max-w-60 rounded-md border bg-layer p-2"
                >
                  <p>
                    The title needs to be between {BLUEPRINT_TITLE_MIN_LENGTH}-{BLUEPRINT_TITLE_MAX_LENGTH}
                    characters long.
                  </p>
                  <p>
                    It can only contain spaces and these characters: A-Za-z0-9_-
                  </p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </Label>
        {/snippet}
      </Control>
      <FieldErrors class="text-error" />
    {/snippet}
  </Field>

  <Field {form} name="data">
    {#snippet children({ constraints })}
      <Control>
        {#snippet children({ props })}
          <Label class="{input.group()} max-h-none !items-start">
            <span class="icon-[tabler--braces] my-4">Blueprint Identifier</span>
            <textarea
              class="{input.field()} min-h-14 py-4"
              rows="10"
              placeholder="Blueprint identifier"
              {...props}
              {...constraints}
              bind:value={$formData.data}
            ></textarea>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  class="{button({
                    kind: 'ghost',
                    intent: 'muted',
                    size: 'icon-sm',
                  })} my-3"
                >
                  <span class="icon-[tabler--info-circle]"></span>
                </Tooltip.Trigger>
                <Tooltip.Content
                  class="max-w-60 rounded-md border bg-layer p-2"
                >
                  <p>
                    The blueprint identifier needs to be in the standard format
                    of the game: <br />
                    <i>SHAPEZ-2 ... $</i>
                  </p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </Label>
        {/snippet}
      </Control>
      <FieldErrors class="text-error" />
    {/snippet}
  </Field>

  <div class="mb-2 space-y-2">
    <div class="flex items-center gap-2">
      <Checkbox.Root
        class="peer inline-flex size-8 items-center justify-center rounded-sm border border-muted bg-foreground transition-all duration-150 ease-in-out data-[state=unchecked]:bg-background"
        id="is-preview"
        aria-labelledby="is-preview-label"
        bind:checked={blueprintPreview}
      >
        {#snippet children({ checked })}
          <div
            class="inline-flex size-4 items-center justify-center text-background"
          >
            {#if checked}
              <span class="icon-[tabler--check]"></span>
            {/if}
          </div>
        {/snippet}
      </Checkbox.Root>
      <label
        class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        id="is-preview-label"
        for="is-preview">Use blueprint preview</label
      >
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            class={button({
              kind: 'ghost',
              intent: 'muted',
              size: 'icon-sm',
            })}
          >
            <span class="icon-[tabler--info-circle]"></span>
          </Tooltip.Trigger>
          <Tooltip.Content class="max-w-60 rounded-md border bg-layer p-2">
            <p>
              This preview will be used to create an image of your blueprint.
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <div class="space-y-2" class:hidden={!blueprintPreview}>
      <BlueprintView
        identifier={$formData.data}
        {blueprint}
        controls={{}}
        bind:this={blueprintView}
      />

      <Button.Root
        class={button({ kind: 'outline', block: true })}
        type="button"
        onclick={async () => {
          try {
            if (!blueprintImagesFileInput) {
              throw new Error('Blueprint image field unavailable');
            }
            const canvas = blueprintView?.canvas();
            if (!canvas) {
              throw new Error('Preview canvas unavailable');
            }
            const blob = await toBlob(canvas);
            const previewImage = new File([blob], 'preview.png', {
              type: 'image/webp',
            });

            $formData.images = [...($formData.images ?? []), previewImage];
            add({ message: 'Screenshot added to images', type: 'SUCCESS' });
          } catch (err) {
            if (err instanceof Error) {
              add({ message: err.message, type: 'ERROR' });
            }
          }
        }}
      >
        <span class="icon-[tabler--camera]"></span>
        Take screenshot
      </Button.Root>
    </div>
  </div>

  <Field {form} name="images">
    {#snippet children({ constraints })}
      <Control>
        {#snippet children({ props })}
          <Label class="{input.group({ type: 'file' })} relative h-32">
            <input
              class="{input.field()} cursor-pointer [text-indent:-9999rem]"
              type="file"
              accept={BLUEPRINT_IMAGE_TYPES.join(',')}
              multiple
              {...props}
              {...constraints}
              bind:this={blueprintImagesFileInput}
              onchange={(event) => {
                const target = event.currentTarget;
                const files = [...(target.files ?? []), ...$images];
                if (files.length > BLUEPRINT_IMAGES_MAX) {
                  add({
                    message: `Max. amount of images is ${BLUEPRINT_IMAGES_MAX}`,
                    type: 'WARNING',
                  });
                }
                $images = toFileList(files.slice(0, BLUEPRINT_IMAGES_MAX));
              }}
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div>
                <span class="icon-[tabler--photo-up] size-8 align-middle"
                ></span>
                <span>Images</span>
                <span class="text-muted">(optional)</span>
              </div>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    class="{button({
                      kind: 'ghost',
                      intent: 'muted',
                      size: 'icon-sm',
                    })} absolute right-4 top-3"
                  >
                    <span class="icon-[tabler--info-circle]"></span>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    class="max-w-60 rounded-md border bg-layer p-2"
                  >
                    <p>
                      The first image will be used as the thumbnail. When using
                      the preview, it will generate a thumbnail from the
                      perspective of the preview.
                    </p>
                    <p>
                      Max. {BLUEPRINT_IMAGES_MAX} images, including preview image.
                    </p>
                    <p>
                      Max. file size is {BLUEPRINT_IMAGE_MAX_FILE_SIZE /
                        1024 /
                        1024}MB.
                    </p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </Label>
        {/snippet}
      </Control>

      {#if $images.length > 0}
        <ol
          class="grid auto-rows-auto grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
        >
          {#each $images as image, index (index)}
            <li
              class="relative flex flex-col divide-y overflow-hidden rounded-md border"
            >
              <div class="mb-auto p-2">
                <div class="flex items-center">
                  <i
                    class="mr-auto inline-flex items-center justify-center gap-2 rounded-xs bg-accent px-2 py-1 text-accent-foreground"
                  >
                    #{index + 1}
                  </i>

                  {#if index > 0}
                    <Button.Root
                      class={button({
                        kind: 'ghost',
                        intent: 'accent',
                        size: 'icon-sm',
                      })}
                      type="button"
                      onclick={() => {
                        const files = [...$images];
                        const temp = files[index - 1];
                        files[index - 1] = files[index];
                        files[index] = temp;
                        $images = toFileList(files);
                      }}
                    >
                      <span class="icon-[tabler--chevron-left]"></span>
                    </Button.Root>
                  {/if}
                  {#if index < $images.length - 1}
                    <Button.Root
                      class={button({
                        kind: 'ghost',
                        intent: 'accent',
                        size: 'icon-sm',
                      })}
                      type="button"
                      onclick={() => {
                        const files = [...$images];
                        const temp = files[index + 1];
                        files[index + 1] = files[index];
                        files[index] = temp;
                        $images = toFileList(files);
                      }}
                    >
                      <span class="icon-[tabler--chevron-right]"></span>
                    </Button.Root>
                  {/if}
                  <Button.Root
                    class={button({
                      kind: 'ghost',
                      intent: 'error',
                      size: 'icon-sm',
                    })}
                    type="button"
                    onclick={() => {
                      if (!blueprintImagesFileInput) {
                        return;
                      }

                      const files = [...$images];
                      $images = toFileList(
                        files.filter((_, fileIndex) => fileIndex !== index),
                      );
                    }}
                  >
                    <span class="sr-only">Remove image #{index}</span>
                    <span class="icon-[tabler--x]"></span>
                  </Button.Root>
                </div>

                {#if $imageErrors && $imageErrors[index]}
                  <ul>
                    <li class="text-error">
                      {$imageErrors[index]}
                    </li>
                  </ul>
                {/if}
              </div>

              <picture class="aspect-h-2 aspect-w-3 block">
                <img
                  class="object-cover"
                  src={URL.createObjectURL(image)}
                  alt={`Image #${index} - ${image.name}`}
                />
              </picture>
            </li>
          {/each}
        </ol>
      {/if}

      <FieldErrors class="text-error" />
    {/snippet}
  </Field>

  <Collapsible.Root
    class="group mb-2 rounded-md border"
    open={data.type === 'update' &&
      (!!$formData.tags || !!$formData.description)}
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
          <span>Additional information</span>
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
            <Field {form} name="tags">
              {#snippet children({ constraints })}
                <Control>
                  {#snippet children({ props })}
                    <div class="flex flex-col gap-2">
                      {#if $formData.tags}
                        <ul class="flex flex-wrap gap-2">
                          {#each $formData.tags as tag (tag)}
                            {@const blueprintTag = data.tags.find(
                              (blueprintTag) => tag === blueprintTag.id,
                            )}
                            <li>
                              <span
                                class="inline-flex items-center gap-1 rounded-xs border pl-2"
                              >
                                {#if blueprintTag}
                                  #{blueprintTag.name}
                                {:else}
                                  #{tag.replace('$', '')}
                                {/if}

                                <Button.Root
                                  class={button({
                                    intent: 'error',
                                    kind: 'ghost',
                                    size: 'icon-sm',
                                  })}
                                  type="button"
                                  onclick={() => {
                                    $formData.tags = $formData.tags?.filter(
                                      (value) => value !== tag,
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
                      {/if}

                      <Combobox.Root
                        type="multiple"
                        items={tags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                        }))}
                        name={props.name}
                        bind:value={$formData.tags}
                      >
                        <label class={input.group()} for="blueprint-tag-input">
                          <span class="icon-[tabler--tags]"></span>
                          <Combobox.Input
                            class={input.field()}
                            id="blueprint-tag-input"
                            placeholder="Select tags"
                            aria-label="Select tags"
                            {...constraints}
                            oninput={(event) =>
                              (blueprintTagInputValue =
                                event.currentTarget.value)}
                          />
                          <Tooltip.Provider>
                            <Tooltip.Root>
                              <Tooltip.Trigger
                                class="{button({
                                  kind: 'ghost',
                                  intent: 'muted',
                                  size: 'icon-sm',
                                })} my-3"
                              >
                                <span class="icon-[tabler--info-circle]"></span>
                              </Tooltip.Trigger>
                              <Tooltip.Content
                                class="max-w-60 rounded-md border bg-layer p-2"
                              >
                                <p>
                                  A list of tags for the blueprint (max. {BLUEPRINT_TAGS_MAX}).
                                </p>
                              </Tooltip.Content>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        </label>

                        <Combobox.Content
                          class="relative z-10 max-h-64 overflow-y-auto overflow-x-hidden rounded-md border bg-layer p-2"
                          sideOffset={20}
                        >
                          {#each tags as tag (tag.id)}
                            <Combobox.Item
                              class="flex cursor-pointer justify-between gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                              value={tag.id}
                              label={tag.name}
                            >
                              {#snippet children({ selected })}
                                #{tag.name}

                                {#if selected}
                                  <span class="icon-[tabler--check]"
                                    >selected</span
                                  >
                                {/if}
                              {/snippet}
                            </Combobox.Item>
                          {/each}

                          {#if !$formData.tags?.find((tag) => tag === `${BLUEPRINT_TAG_NEW_SYMBOL}${blueprintTagInputValue}`)}
                            {#if !BLUEPRINT_TAG_REGEX.test(blueprintTagInputValue)}
                              {#if tags.length <= 0}
                                <span class="px-4 py-1 text-error"
                                  >Invalid tag.</span
                                >
                              {/if}
                            {:else}
                              {#if tags.length <= 0}
                                <p class="px-4 py-1">No results found.</p>
                              {/if}
                              <Combobox.Separator class="my-1 h-px bg-muted" />

                              <Combobox.Item
                                class="flex w-full cursor-pointer justify-between gap-2 rounded-xs px-4 py-1 outline-none transition hover:bg-border focus-visible:bg-border data-[highlighted]:bg-border"
                                value="${blueprintTagInputValue}"
                                label={blueprintTagInputValue}
                              >
                                <em>Add #{blueprintTagInputValue}</em>
                              </Combobox.Item>
                            {/if}
                          {/if}
                        </Combobox.Content>
                      </Combobox.Root>
                    </div>
                  {/snippet}
                </Control>
                <FieldErrors class="text-error" />
              {/snippet}
            </Field>

            <Field {form} name="description">
              {#snippet children({ constraints })}
                <Control>
                  {#snippet children({ props })}
                    <Label class="{input.group()} max-h-none !items-start">
                      <span class="icon-[tabler--align-left] my-4"
                        >Description</span
                      >
                      <textarea
                        class="{input.field()} min-h-14 py-4"
                        rows="10"
                        placeholder="Description"
                        {...props}
                        {...constraints}
                        bind:value={$formData.description}
                      ></textarea>
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger
                            class="{button({
                              kind: 'ghost',
                              intent: 'muted',
                              size: 'icon-sm',
                            })} my-3"
                          >
                            <span class="icon-[tabler--info-circle]"></span>
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            class="max-w-60 rounded-md border bg-layer p-2"
                          >
                            <p>
                              The description has a max. length of {BLUEPRINT_DESCRIPTION_MAX_LENGTH}.
                            </p>
                          </Tooltip.Content>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </Label>
                  {/snippet}
                </Control>
                <FieldErrors class="text-error" />
              {/snippet}
            </Field>
          </div>
        {/if}
      {/snippet}
    </Collapsible.Content>
  </Collapsible.Root>

  <Button.Root
    class={button({ intent: 'primary', block: true })}
    onclick={onSubmit}
  >
    {#if data.type === 'create'}
      <span class="icon-[tabler--upload]"></span>
      Upload
    {:else if data.type === 'update'}
      <span class="icon-[tabler--refresh]"></span>
      Update
    {/if}
  </Button.Root>
</form>

<AlertDialog.Root open={!!leaveUrl}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay class={dialog.overlay()} />
    <AlertDialog.Content forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class={dialog.content({ position: 'center' })}
            transition:fade={{ duration: 150 }}
          >
            <div class="relative rounded-lg border bg-layer p-4">
              <AlertDialog.Title class="heading-4" level={2}
                >Unsaved changes will be lost!</AlertDialog.Title
              >

              <div class="flex items-center justify-end gap-2">
                <AlertDialog.Cancel
                  class={button({ intent: 'accent', kind: 'outline' })}
                  onclick={() => (leaveUrl = undefined)}
                  >Cancel</AlertDialog.Cancel
                >
                <AlertDialog.Action
                  class={button({ intent: 'error' })}
                  onclick={async () => {
                    if (!leaveUrl) return;

                    await goto(leaveUrl);
                    leaveUrl = undefined;
                  }}
                >
                  Leave
                </AlertDialog.Action>
              </div>
            </div>
          </div>
        {/if}
      {/snippet}
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
