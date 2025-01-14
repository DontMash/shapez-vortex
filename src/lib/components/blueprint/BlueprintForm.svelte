<script lang="ts">
  import { onMount } from 'svelte';
  import {
    superForm,
    arrayProxy,
    filesProxy,
    type Infer,
    type SuperValidated,
  } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { beforeNavigate, goto } from '$app/navigation';
  import { toBlob } from '$lib/utils';
  import { add } from '$lib/client/toast.service';
  import { decode, isBlueprintIdentifier } from '$lib/blueprint';
  import {
    BLUEPRINT_DESCRIPTION_MAX_LENGTH,
    BLUEPRINT_FORM_SCHEMA,
    BLUEPRINT_IMAGE_MAX_FILE_SIZE,
    BLUEPRINT_IMAGE_TYPES,
    BLUEPRINT_IMAGES_MAX,
    BLUEPRINT_TAG_REGEX,
    BLUEPRINT_TAGS_MAX,
    BLUEPRINT_TITLE_MAX_LENGTH,
    BLUEPRINT_TITLE_MIN_LENGTH,
    type BlueprintFormSchema,
  } from '$lib/blueprint.schema';
  import {
    BLUEPRINT_FILE_FORMAT,
    type Blueprint,
    type BlueprintRecordData,
    type BlueprintTag,
  } from '$lib/blueprint.types';

  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Badge } from '$lib/components/ui/badge';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import * as Command from '$lib/components/ui/command';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Tooltip from '$lib/components/ui/tooltip';

  import { Combobox } from '$lib/components/combobox';
  import BlueprintView from '$lib/components/blueprint/BlueprintView.svelte';

  export let data: {
    form: SuperValidated<Infer<BlueprintFormSchema>>;
    type: 'create' | 'update';
    tags: Array<BlueprintTag>;
    record?: BlueprintRecordData;
    images?: Array<{ src: string }>;
  };

  const form = superForm(data.form, {
    validators: zod(BLUEPRINT_FORM_SCHEMA),
  });
  const { form: formData, enhance, tainted, submit } = form;
  let isSubmit = false;
  let leaveUrl: URL | undefined;
  let { valueErrors: imageErrors } = arrayProxy(form, 'images');
  let images = filesProxy(form, 'images');

  let blueprint: Blueprint | undefined;
  let blueprintTags: Set<string> = new Set();
  let tags: Array<BlueprintTag> = [];
  let blueprintTagValue: string = '';
  let blueprintTagCombobox: Combobox;
  let blueprintImagesFileInput: HTMLInputElement | undefined;
  let blueprintView: BlueprintView;
  let blueprintPreview: boolean = data.type === 'create';
  $: {
    try {
      blueprint =
        $formData.data && isBlueprintIdentifier($formData.data)
          ? decode($formData.data)
          : undefined;
    } catch {
      blueprint = undefined;
      add({ message: 'Invalid blueprint identifier', type: 'ERROR' });
    }

    tags = data.tags?.filter(
      (tag: BlueprintTag) => !blueprintTags.has(tag.name),
    );

    if (blueprintImagesFileInput) {
      blueprintImagesFileInput.files = $images;
    }
  }

  function addTag(value: string) {
    blueprintTags.add(value);
    blueprintTags = blueprintTags;
    $formData.tags = [...blueprintTags].join(',');
  }
  async function onSubmit() {
    if (!blueprintPreview) {
      isSubmit = true;
      return submit();
    }

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
        type: 'image/png',
      });

      const data = new DataTransfer();
      const files = [...$images, previewImage];
      files.forEach((file) => data.items.add(file));
      blueprintImagesFileInput.files = data.files;
    } catch (err) {
      const error = err as Error;
      add({ message: error.message, type: 'ERROR' });
    } finally {
      isSubmit = true;
      submit();
    }
  }

  onMount(async () => {
    if (data.record) {
      const record = data.record;
      $formData.title = record.title;
      $formData.data = record.data;
      $formData.tags = data.tags
        .filter((tag) => record.tags.includes(tag.id))
        .map((tag) => tag.name)
        .join(',');
      $formData.description = record.description;

      if (data.images) {
        const promises = data.images?.map<Promise<File>>(
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
    }
    if ($formData.tags) {
      blueprintTags = new Set($formData.tags.split(','));
    }
  });
  beforeNavigate((navigation) => {
    if (!$tainted || isSubmit || leaveUrl) {
      isSubmit = false;
      return;
    }

    navigation.cancel();

    leaveUrl = navigation.to?.url;
  });
</script>

<form class="space-y-4" method="post" enctype="multipart/form-data" use:enhance>
  <Form.Field {form} name="title">
    <Form.Control let:attrs>
      <Form.Label>
        <span>Title</span>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span
              class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              The title needs to be between {BLUEPRINT_TITLE_MIN_LENGTH}-{BLUEPRINT_TITLE_MAX_LENGTH}
              characters long.
            </p>
            <p>It can only contain spaces and these characters: A-Za-z0-9_-</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Form.Label>
      <Input
        placeholder="My blueprint ..."
        {...attrs}
        bind:value={$formData.title}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="data">
    <Form.Control let:attrs>
      <Form.Label>
        <span>Blueprint Identifier</span>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span
              class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              The blueprint identifier needs to be <br />in the standard format
              of the game.
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Form.Label>
      <Textarea
        class="h-64 resize-none"
        placeholder="SHAPEZ-2 ... $"
        {...attrs}
        bind:value={$formData.data}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <label class="relative mt-4 block" for="blueprint-file">
    <input
      class="peer h-32 w-full cursor-pointer rounded-md border border-input bg-background outline-2 outline-offset-2 outline-ring transition-colors [text-indent:-9999rem] hover:bg-foreground focus-visible:outline"
      type="file"
      id="blueprint-file"
      accept={BLUEPRINT_FILE_FORMAT}
      multiple
      on:change={async (event) => {
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
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors peer-hover:text-background"
    >
      <span class="icon-[tabler--file-upload] size-8 align-middle" />
      <span>Blueprint file</span>
      <Tooltip.Root>
        <Tooltip.Trigger class="pointer-events-auto">
          <span
            class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>
            The name and content of the file will be added to the fields above.
          </p>
          <p>(If there already is a title present, it wont be replaced)</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </label>

  <Collapsible.Root class="group rounded-md border bg-card">
    <Collapsible.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        class="w-full justify-between space-x-2 group-data-[state=open]:mb-2"
        variant="ghost"
      >
        <span>Additional information</span>
        <span
          class="icon-[tabler--chevron-down] align-text-bottom text-lg transition-transform group-data-[state=open]:-rotate-180"
        />
      </Button>
    </Collapsible.Trigger>

    <Collapsible.Content class="space-y-4 p-4">
      <Form.Field {form} name="tags">
        <Form.Control let:attrs>
          <Form.Label>
            <span>Tags <span class="text-input">(optional)</span></span>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span
                  class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>
                  A list of tags for the blueprint (max. {BLUEPRINT_TAGS_MAX}).
                </p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Form.Label>
          {#if blueprintTags.size > 0}
            <div>
              {#each blueprintTags as tag}
                <Badge class="h-8 space-x-1 pr-1" variant="outline">
                  <span>#{tag}</span>
                  <Button
                    class="size-6 p-0"
                    variant="ghost"
                    size="icon"
                    on:click={() => {
                      blueprintTags.delete(tag);
                      blueprintTags = blueprintTags;
                    }}
                  >
                    <span class="sr-only">Remove tag {tag}</span>
                    <span class="icon-[tabler--x]" />
                  </Button>
                </Badge>
              {/each}
            </div>
          {/if}
          <Input type="hidden" {...attrs} value={$formData.tags} />
          <Combobox
            options={tags.map((tag) => ({
              label: tag.name,
              value: tag.name,
            }))}
            placeholder="Select tags..."
            on:input={(event) => (blueprintTagValue = event.detail)}
            on:value={(event) => addTag(event.detail)}
            bind:this={blueprintTagCombobox}
          >
            {#if blueprintTagValue && BLUEPRINT_TAG_REGEX.test(blueprintTagValue) && !blueprintTags.has(blueprintTagValue) && !tags.find((tag) => tag.name === blueprintTagValue)}
              <Command.Separator />
              <Command.Group alwaysRender>
                <Command.Item
                  class="px-8 italic"
                  value={blueprintTagValue}
                  alwaysRender
                  onSelect={() => {
                    addTag(blueprintTagValue);
                    blueprintTagCombobox.close();
                  }}
                >
                  #{blueprintTagValue}
                </Command.Item>
              </Command.Group>
            {/if}
          </Combobox>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="description">
        <Form.Control let:attrs>
          <Form.Label>
            <span>Description <span class="text-input">(optional)</span></span>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <span
                  class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>
                  The description has a max. length of {BLUEPRINT_DESCRIPTION_MAX_LENGTH}
                </p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Form.Label>
          <Textarea
            class="h-48"
            placeholder="Reimagine shape processing ..."
            {...attrs}
            bind:value={$formData.description}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Collapsible.Content>
  </Collapsible.Root>

  <Form.Field {form} name="images">
    <Form.Control let:attrs>
      <Form.Label>
        <span>Images <span class="text-input">(optional)</span></span>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span
              class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              Max. {BLUEPRINT_IMAGES_MAX} images, including preview image.
            </p>
            <p>
              Max. file size is {BLUEPRINT_IMAGE_MAX_FILE_SIZE / 1024 / 1024}MB.
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Form.Label>
      <div class="relative">
        <input
          class="hidden"
          type="file"
          accept={BLUEPRINT_IMAGE_TYPES.join(',')}
          multiple
          {...attrs}
          bind:this={blueprintImagesFileInput}
        />
        <input
          class="peer h-32 w-full cursor-pointer rounded-md border border-input bg-background outline-2 outline-offset-2 outline-ring transition-colors [text-indent:-9999rem] hover:bg-foreground focus-visible:outline"
          type="file"
          accept={BLUEPRINT_IMAGE_TYPES.join(',')}
          multiple
          on:change={(event) => {
            const input = event.currentTarget;
            if (!input.files) return;

            const data = new DataTransfer();
            const files = [...input.files, ...$images];
            const max = BLUEPRINT_IMAGES_MAX - 1;
            if (files.length > max) {
              add({
                message: `Max. ${BLUEPRINT_IMAGES_MAX} images, including preview image.`,
                type: 'WARNING',
              });
            }
            files.slice(0, max).forEach((file) => {
              if (!BLUEPRINT_IMAGE_TYPES.find((type) => file.type === type))
                return;
              data.items.add(file);
            });

            $images = data.files;
            input.files = null;
          }}
        />
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors peer-hover:text-background"
        >
          <span class="icon-[tabler--photo-up] size-8 align-middle" />
          <span>Select images</span>
          <Tooltip.Root>
            <Tooltip.Trigger class="pointer-events-auto">
              <span
                class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Selected images will be added to the blueprint.</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </div>
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  {#if $images.length > 0}
    <ol class="grid auto-rows-auto grid-cols-3 gap-4">
      {#each $images as image, index}
        {@const imageError = $imageErrors[index]}
        <li class="relative">
          <picture class="aspect-h-2 aspect-w-3 block">
            <img
              class="rounded-md border object-cover"
              src={URL.createObjectURL(image)}
              alt={`Image #${index} - ${image.name}`}
            />
          </picture>

          {#if imageError}
            <span class="text-destructive">{imageError}</span>
          {/if}

          <Badge class="absolute left-2 top-2 font-bold" variant="secondary">
            #{index + 1}
          </Badge>

          <div class="absolute right-2 top-2">
            {#if index > 0}
              <Button
                variant="outline"
                size="icon"
                on:click={() => {
                  const data = new DataTransfer();
                  const files = [...$images];
                  const temp = files[index - 1];
                  files[index - 1] = files[index];
                  files[index] = temp;
                  files.forEach((file) => data.items.add(file));
                  $images = data.files;
                }}
              >
                <span class="icon-[tabler--chevron-left]" />
              </Button>
            {/if}
            {#if index < $images.length - 1}
              <Button
                variant="outline"
                size="icon"
                on:click={() => {
                  const data = new DataTransfer();
                  const files = [...$images];
                  const temp = files[index + 1];
                  files[index + 1] = files[index];
                  files[index] = temp;
                  files.forEach((file) => data.items.add(file));
                  $images = data.files;
                }}
              >
                <span class="icon-[tabler--chevron-right]" />
              </Button>
            {/if}
            <Button
              variant="destructive"
              size="icon"
              on:click={() => {
                const data = new DataTransfer();
                const files = [...$images];
                files
                  .filter((_, fileIndex) => fileIndex !== index)
                  .forEach((file) => data.items.add(file));
                $images = data.files;
              }}
            >
              <span class="sr-only">Remove image #{index}</span>
              <span class="icon-[tabler--x]" />
            </Button>
          </div>
        </li>
      {/each}
    </ol>
  {/if}

  <div class="space-y-2">
    <Label class="flex items-center space-x-1 lg:px-0">
      {#if data.type === 'update'}
        <Checkbox
          aria-labelledby="blueprint-preview-label"
          bind:checked={blueprintPreview}
        />
      {/if}
      <span
        >{data.type === 'update'
          ? 'Update blueprint preview'
          : 'Blueprint preview'}</span
      >
      <Tooltip.Root>
        <Tooltip.Trigger>
          <span
            class="icon-[tabler--info-circle] align-text-bottom text-lg text-input"
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>
            This preview will be used to create an image of your blueprint..
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Label>
    <div class="-mx-4 lg:mx-0" class:hidden={!blueprintPreview}>
      <BlueprintView
        identifier={$formData.data}
        {blueprint}
        controls={{}}
        bind:this={blueprintView}
      />
    </div>
  </div>

  <Button
    class="mt-12 w-full"
    type="button"
    aria-roledescription="submit"
    on:click={onSubmit}
  >
    {data.type === 'create' ? 'Upload' : 'Update'}
  </Button>
</form>

<AlertDialog.Root open={!!leaveUrl}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure you want to leave?</AlertDialog.Title>
      <AlertDialog.Description
        >Unsaved changes will be lost.</AlertDialog.Description
      >
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={() => (leaveUrl = undefined)}
        >Cancel</AlertDialog.Cancel
      >
      <AlertDialog.Action
        class={buttonVariants({ variant: 'destructive' })}
        on:click={async () => {
          if (!leaveUrl) return;

          await goto(leaveUrl);
          leaveUrl = undefined;
        }}
      >
        Leave
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
