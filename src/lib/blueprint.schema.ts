import { z } from 'zod';
import {
  BLUEPRINT_IDENTIFIER_REGEX,
  decode,
  type BlueprintIdentifier,
} from '$lib/blueprint';
import { GAME_VERSION } from '$lib/game';
import { isShapeIdentifier, type ShapeIdentifier } from '$lib/shape.types';

export const BLUEPRINT_FILE_FORMAT = '.spz2bp' as const;

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
  .refine((value) => {
    if (value.startsWith(BLUEPRINT_TAG_NEW_SYMBOL)) {
      return BLUEPRINT_TAG_REGEX.test(value.slice(1));
    }
    return BLUEPRINT_TAG_REGEX.test(value);
  }, `String must be between ${BLUEPRINT_TAG_MIN_LENGTH} to ${BLUEPRINT_TAG_MAX_LENGTH} characters long and only contain: "A-Za-z0-9_-"`)
  .array();
export const BLUEPRINT_FORM_SCHEMA = z.object({
  title: BLUEPRINT_TITLE_SCHEMA,
  description: BLUEPRINT_DESCRIPTION_SCHEMA.optional(),
  data: BLUEPRINT_DATA_SCHEMA.refine((value) => {
    const blueprint = decode(value);
    return blueprint.V >= GAME_VERSION;
  }, `Must be of the current referenced/newest version of the game: ${GAME_VERSION}`),
  images: BLUEPRINT_IMAGES_SCHEMA.optional(),
  tags: BLUEPRINT_TAGS_SCHEMA.optional(),
});
export type BlueprintFormSchema = typeof BLUEPRINT_FORM_SCHEMA;
export type BlueprintFormData = z.infer<typeof BLUEPRINT_FORM_SCHEMA>;

export const BLUEPRINT_TYPES = ['Island', 'Building'] as const;
const BLUEPRINT_TYPE_SCHEMA = z.enum(BLUEPRINT_TYPES);
export type BlueprintType = z.infer<typeof BLUEPRINT_TYPE_SCHEMA>;
export const BLUEPRINT_CREATE_SCHEMA = z.object({
  title: BLUEPRINT_TITLE_SCHEMA,
  description: BLUEPRINT_DESCRIPTION_SCHEMA,
  images: BLUEPRINT_IMAGES_SCHEMA,
  tags: z.string().array(),
  data: BLUEPRINT_DATA_SCHEMA,
  type: BLUEPRINT_TYPE_SCHEMA,
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

const BLUEPRINT_ENTRY_ROTATION_SCHEMA = z.union([
  z.literal(0) /* East */,
  z.literal(1) /* South */,
  z.literal(2) /* West */,
  z.literal(3) /* North */,
]);
const BLUEPRINT_ICON_DATA_ICON_SCHEMA = z.string().transform((value, ctx) => {
  const regex = new RegExp('^icon:\\w+$');
  if (!regex.test(value)) {
    ctx.addIssue({ code: 'custom', message: 'Invalid icon identifier' });
  }
  return value as `icon:${string}`;
});
const BLUEPRINT_ICON_DATA_SHAPE_SCHEMA = z
  .string()
  .regex(new RegExp('^shape:\\w+$'), 'Invalid shape icon data')
  .transform((value, ctx) => {
    const shapeIdentifier = value.split(':')[1];
    if (!isShapeIdentifier(shapeIdentifier)) {
      ctx.addIssue({ code: 'custom', message: 'Invalid shape identifier' });
    }
    return value as `shape:${ShapeIdentifier}`;
  });
const BLUEPRINT_ICON_DATA_SCHEMA = z.union([
  BLUEPRINT_ICON_DATA_SHAPE_SCHEMA,
  BLUEPRINT_ICON_DATA_ICON_SCHEMA,
  z.null(),
]);
const BLUEPRINT_ICON_SCHEMA = z.object({
  Data: z.tuple([
    BLUEPRINT_ICON_DATA_SCHEMA,
    BLUEPRINT_ICON_DATA_SCHEMA,
    BLUEPRINT_ICON_DATA_SCHEMA,
    BLUEPRINT_ICON_DATA_SCHEMA,
  ]),
});
export const BLUEPRINT_BUILDING_ENTRY_SCHEMA = z.object({
  T: z.string(),
  X: z.number().int().optional(),
  Y: z.number().int().optional(),
  L: z.number().int().optional(),
  R: BLUEPRINT_ENTRY_ROTATION_SCHEMA.optional(),
  C: z.string().optional(),
});
export const BLUEPRINT_BUILDING_SCHEMA = z.object({
  $type: z.literal(BLUEPRINT_TYPES[1]),
  Entries: BLUEPRINT_BUILDING_ENTRY_SCHEMA.array(),
  Icon: BLUEPRINT_ICON_SCHEMA.optional(),
});
export const BLUEPRINT_ISLAND_ENTRY_SCHEMA = z.object({
  T: z.string(),
  X: z.number().int().optional(),
  Y: z.number().int().optional(),
  R: BLUEPRINT_ENTRY_ROTATION_SCHEMA.optional(),
  B: BLUEPRINT_BUILDING_SCHEMA,
});
export const BLUEPRINT_ISLAND_SCHEMA = z.object({
  $type: z.literal(BLUEPRINT_TYPES[0]),
  Entries: BLUEPRINT_ISLAND_ENTRY_SCHEMA.array(),
  Icon: BLUEPRINT_ICON_SCHEMA.optional(),
});
export const BLUEPRINT_SCHEMA = z.object({
  V: z.number().int().min(GAME_VERSION) /* version */,
  BP: z.discriminatedUnion('$type', [
    BLUEPRINT_ISLAND_SCHEMA,
    BLUEPRINT_BUILDING_SCHEMA,
  ]),
});

export const BLUEPRINT_RECORD_SCHEMA = BLUEPRINT_CREATE_SCHEMA.extend({
  images: z.string().array(),
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
