import { z } from 'zod';
import { decode } from '$lib/blueprint';
import {
  BLUEPRINT_IDENTIFIER_REGEX,
  BLUEPRINT_TYPES,
  type BlueprintIdentifier,
} from '$lib/blueprint.types';
import { GAME_VERSION } from '$lib/game';

export const BLUEPRINT_TITLE_MIN_LENGTH = 3;
export const BLUEPRINT_TITLE_MAX_LENGTH = 64;
export const BLUEPRINT_TITLE_REGEX = new RegExp(
  `^[\\w-\\s]{${BLUEPRINT_TITLE_MIN_LENGTH},${BLUEPRINT_TITLE_MAX_LENGTH}}$`,
);
export const BLUEPRINT_DESCRIPTION_MAX_LENGTH = 2048;
export const BLUEPRINT_TAG_MIN_LENGTH = 3;
export const BLUEPRINT_TAG_MAX_LENGTH = 24;
export const BLUEPRINT_TAG_REGEX = new RegExp(
  `^[\\w-]{${BLUEPRINT_TAG_MIN_LENGTH},${BLUEPRINT_TAG_MAX_LENGTH}}$`,
);
export const BLUEPRINT_TAGS_MAX = 8;
export const BLUEPRINT_TAG_NEW_SYMBOL = '$';
export const BLUEPRINT_IMAGE_MAX_FILE_SIZE = 1_048_576;
export const BLUEPRINT_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;
type BlueprintImageType = (typeof BLUEPRINT_IMAGE_TYPES)[number];
export const BLUEPRINT_IMAGES_MAX = 4;
const BLUEPRINT_TITLE_SCHEMA = z
  .string()
  .min(BLUEPRINT_TITLE_MIN_LENGTH)
  .max(BLUEPRINT_TITLE_MAX_LENGTH)
  .regex(
    BLUEPRINT_TITLE_REGEX,
    'String must only contain these characters: "A-Za-z0-9_-"',
  );
const BLUEPRINT_DESCRIPTION_SCHEMA = z
  .string()
  .max(BLUEPRINT_DESCRIPTION_MAX_LENGTH);
const BLUEPRINT_DATA_SCHEMA = z
  .custom<BlueprintIdentifier>(
    (data) => BLUEPRINT_IDENTIFIER_REGEX.test(data as string),
    'Incorrect blueprint identifier format',
  )
  .refine((value) => {
    try {
      decode(value);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid blueprint data');
const BLUEPRINT_IMAGES_SCHEMA = z
  .instanceof(File)
  .refine((value) => value.size > 0, 'Empty file')
  .refine(
    (value) => value.size < BLUEPRINT_IMAGE_MAX_FILE_SIZE,
    `Max. image size is ${BLUEPRINT_IMAGE_MAX_FILE_SIZE / 1024 / 1024}MB.`,
  )
  .refine(
    (value) => BLUEPRINT_IMAGE_TYPES.includes(value.type as BlueprintImageType),
    `Accepted image formats are: ${BLUEPRINT_IMAGE_TYPES.join(', ')}`,
  )
  .array()
  .max(
    BLUEPRINT_IMAGES_MAX,
    `Max. amount of images is ${BLUEPRINT_IMAGES_MAX}`,
  );
const BLUEPRINT_TAGS_SCHEMA = z
  .string()
  .array()
  .refine((value) => {
    return value.reduce(
      (result, value) =>
        result &&
        (!value.startsWith(BLUEPRINT_TAG_NEW_SYMBOL) ||
          BLUEPRINT_TAG_REGEX.test(value.slice(1))),
      true,
    );
  }, 'String must only contain these characters: "A-Za-z0-9_-"');
export const BLUEPRINT_FORM_SCHEMA = z.object({
  title: BLUEPRINT_TITLE_SCHEMA,
  description: BLUEPRINT_DESCRIPTION_SCHEMA.optional(),
  data: BLUEPRINT_DATA_SCHEMA,
  images: BLUEPRINT_IMAGES_SCHEMA.optional(),
  tags: BLUEPRINT_TAGS_SCHEMA.optional(),
});
export type BlueprintFormSchema = typeof BLUEPRINT_FORM_SCHEMA;
export type BlueprintFormData = z.infer<typeof BLUEPRINT_FORM_SCHEMA>;

export const BLUEPRINT_CREATE_SCHEMA = z.object({
  title: BLUEPRINT_TITLE_SCHEMA,
  description: BLUEPRINT_DESCRIPTION_SCHEMA,
  images: BLUEPRINT_IMAGES_SCHEMA,
  tags: z.array(z.string()),
  data: BLUEPRINT_DATA_SCHEMA,
  type: z.enum(['Island', 'Building']),
  cost: z.number().min(0),
  buildings: z.string(),
  buildingCount: z.number().min(1),
  islandCount: z.number().min(0),
  creator: z.string(),
  viewCount: z.number().min(1),
  downloadCount: z.number().min(1),
  bookmarkCount: z.number().min(1),
  version: z.number().min(1),
});

export const BLUEPRINT_SCHEMA = z.object({
  V: z.number(),
  BP: z.object({
    $type: z.enum(BLUEPRINT_TYPES),
    Entries: z.any().array(),
  }),
});
export const BLUEPRINT_RECORD_SCHEMA = z.object({
  title: BLUEPRINT_TITLE_SCHEMA,
  description: BLUEPRINT_DESCRIPTION_SCHEMA,
  images: z.array(z.string()),
  tags: z.array(z.string()),
  data: BLUEPRINT_DATA_SCHEMA,
  type: z.enum(['Island', 'Building']),
  cost: z.number().min(0),
  buildings: z.string(),
  buildingCount: z.number().min(1),
  islandCount: z.number().min(0),
  creator: z.string(),
  viewCount: z.number().min(1),
  downloadCount: z.number().min(1),
  bookmarkCount: z.number().min(1),
  version: z.number().min(1),
});

export const BLUEPRINT_VIEW_SCHEMA = z.object({
  identifier: z.string().max(12500).pipe(BLUEPRINT_DATA_SCHEMA),
});

export const BLUEPRINT_DECODE_SCHEMA = z.object({
  identifier: z.string().max(12500).pipe(BLUEPRINT_DATA_SCHEMA),
});
export const BLUEPRINT_ENCODE_SCHEMA = z.object({
  data: z.string(),
});

export const BLUEPRINT_CONVERT_SCHEMA = z.object({
  version: z.number().min(1000).max(GAME_VERSION).default(GAME_VERSION),
  identifier: z.string().max(12500).pipe(BLUEPRINT_DATA_SCHEMA),
});
