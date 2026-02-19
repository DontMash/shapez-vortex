import { z } from 'zod';
import {
  BLUEPRINT_IDENTIFIER_REGEX,
  decode,
  type BlueprintIdentifier,
} from './index.js';

export const BLUEPRINT_TYPES = ['Island', 'Building'] as const;
export type BlueprintType = (typeof BLUEPRINT_TYPES)[number];

// ---------------------------------------------------------------------------
// Static schemas (no injected dependencies)
// ---------------------------------------------------------------------------

export const BLUEPRINT_DATA_SCHEMA = z
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

export const BLUEPRINT_TYPE_SCHEMA = z.enum(BLUEPRINT_TYPES);

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

// ---------------------------------------------------------------------------
// Schema factories (require injected dependencies)
// ---------------------------------------------------------------------------

/**
 * Creates the icon shape schema, requiring an `isShapeIdentifier` guard to
 * validate shape identifiers without pulling in shape logic as a hard dep.
 */
export function makeBlueprintIconDataShapeSchema(
  isShapeIdentifier: (id: string) => boolean,
) {
  return z
    .string()
    .regex(new RegExp('^shape:\\w+$'), 'Invalid shape icon data')
    .transform((value, ctx) => {
      const shapeIdentifier = value.split(':')[1];
      if (!isShapeIdentifier(shapeIdentifier)) {
        ctx.addIssue({ code: 'custom', message: 'Invalid shape identifier' });
      }
      return value as `shape:${string}`;
    });
}

/**
 * Creates the icon data schema (shape | icon | null).
 */
export function makeBlueprintIconDataSchema(
  isShapeIdentifier: (id: string) => boolean,
) {
  return z.union([
    makeBlueprintIconDataShapeSchema(isShapeIdentifier),
    BLUEPRINT_ICON_DATA_ICON_SCHEMA,
    z.null(),
  ]);
}

const BLUEPRINT_ICON_SCHEMA_STATIC = z.object({
  Data: z.tuple([
    z.union([z.string(), z.null()]),
    z.union([z.string(), z.null()]),
    z.union([z.string(), z.null()]),
    z.union([z.string(), z.null()]),
  ]),
});

/**
 * Creates the icon schema with shape validation.
 */
export function makeBlueprintIconSchema(
  isShapeIdentifier: (id: string) => boolean,
) {
  const iconData = makeBlueprintIconDataSchema(isShapeIdentifier);
  return z.object({
    Data: z.tuple([iconData, iconData, iconData, iconData]),
  });
}

export const BLUEPRINT_BUILDING_ENTRY_SCHEMA = z.object({
  T: z.string(),
  X: z.number().int().optional(),
  Y: z.number().int().optional(),
  L: z.number().int().optional(),
  R: BLUEPRINT_ENTRY_ROTATION_SCHEMA.optional(),
  C: z.string().optional(),
});

/**
 * Creates the building schema, requiring the minimum game version.
 */
export function makeBlueprintBuildingSchema(
  gameVersion: number,
  isShapeIdentifier: (id: string) => boolean,
) {
  return z.object({
    $type: z.literal(BLUEPRINT_TYPES[1]),
    Entries: BLUEPRINT_BUILDING_ENTRY_SCHEMA.array(),
    Icon: makeBlueprintIconSchema(isShapeIdentifier).optional(),
    BinaryVersion: z.number().int().min(gameVersion).optional(),
  });
}

/**
 * Creates the island entry schema, requiring the minimum game version.
 */
export function makeBlueprintIslandEntrySchema(
  gameVersion: number,
  isShapeIdentifier: (id: string) => boolean,
) {
  return z.object({
    T: z.string(),
    X: z.number().int().optional(),
    Y: z.number().int().optional(),
    R: BLUEPRINT_ENTRY_ROTATION_SCHEMA.optional(),
    B: makeBlueprintBuildingSchema(gameVersion, isShapeIdentifier).optional(),
  });
}

/**
 * Creates the island schema, requiring the minimum game version.
 */
export function makeBlueprintIslandSchema(
  gameVersion: number,
  isShapeIdentifier: (id: string) => boolean,
) {
  return z.object({
    $type: z.literal(BLUEPRINT_TYPES[0]),
    Entries: makeBlueprintIslandEntrySchema(gameVersion, isShapeIdentifier).array(),
    Icon: makeBlueprintIconSchema(isShapeIdentifier).optional(),
  });
}

/**
 * Creates the top-level blueprint schema, requiring the minimum game version.
 */
export function makeBlueprintSchema(
  gameVersion: number,
  isShapeIdentifier: (id: string) => boolean,
) {
  return z.object({
    V: z.number().int().min(gameVersion),
    BP: z.discriminatedUnion('$type', [
      makeBlueprintIslandSchema(gameVersion, isShapeIdentifier),
      makeBlueprintBuildingSchema(gameVersion, isShapeIdentifier),
    ]),
  });
}

// Static variants kept for internal use within the package (no shape/version validation).
// These are used in tests that don't need the full validation pipeline.
export const BLUEPRINT_BUILDING_SCHEMA_STATIC = z.object({
  $type: z.literal(BLUEPRINT_TYPES[1]),
  Entries: BLUEPRINT_BUILDING_ENTRY_SCHEMA.array(),
  Icon: BLUEPRINT_ICON_SCHEMA_STATIC.optional(),
  BinaryVersion: z.number().int().optional(),
});

export const BLUEPRINT_ISLAND_ENTRY_SCHEMA_STATIC = z.object({
  T: z.string(),
  X: z.number().int().optional(),
  Y: z.number().int().optional(),
  R: BLUEPRINT_ENTRY_ROTATION_SCHEMA.optional(),
  B: BLUEPRINT_BUILDING_SCHEMA_STATIC.optional(),
});

export const BLUEPRINT_ISLAND_SCHEMA_STATIC = z.object({
  $type: z.literal(BLUEPRINT_TYPES[0]),
  Entries: BLUEPRINT_ISLAND_ENTRY_SCHEMA_STATIC.array(),
  Icon: BLUEPRINT_ICON_SCHEMA_STATIC.optional(),
});

/**
 * Minimal static blueprint schema (no game version enforcement, no shape
 * validation). Used internally for encode/decode round-trip checks where no
 * injected dependencies are available.
 */
export const BLUEPRINT_SCHEMA_STATIC = z.object({
  V: z.number().int(),
  BP: z.discriminatedUnion('$type', [
    BLUEPRINT_ISLAND_SCHEMA_STATIC,
    BLUEPRINT_BUILDING_SCHEMA_STATIC,
  ]),
});
