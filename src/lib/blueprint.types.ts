import type { ComponentType } from 'svelte';
import type { RecordModel } from 'pocketbase';
import type { z } from 'zod';
import type { BLUEPRINT_RECORD_SCHEMA } from '$lib/blueprint.schema';
import type { ShapeIdentifier } from '$lib/shape.types';

import GAME_IDENTIFIERS from '$lib/assets/data/identifiers.json';

export const GAME_VERSION = 1095;

export const BLUEPRINT_FILE_FORMAT = '.spz2bp' as const;
export const BLUEPRINT_EMPTY_DATA = '//8=';
export const BLUEPRINT_GRID_SIZE = 1001;
export const BLUEPRINT_GRID_COLOR = 0x444444;

export type BlueprintRecordData = z.infer<typeof BLUEPRINT_RECORD_SCHEMA>;
export type BlueprintRecord = RecordModel &
  BlueprintRecordData & { images: Array<string> };
export interface BlueprintTag extends RecordModel {
  name: string;
}

export const BLUEPRINT_IDENTIFIER_PREFIX = 'SHAPEZ2' as const;
type BlueprintIdentifierPrefix = typeof BLUEPRINT_IDENTIFIER_PREFIX;
export const BLUEPRINT_IDENTIFIER_VERSION = 1;
type BlueprintIdentifierVersion = number;
export const BLUEPRINT_IDENTIFIER_SEPERATOR = '-' as const;
type BlueprintIdentifierSeperator = typeof BLUEPRINT_IDENTIFIER_SEPERATOR;
export const BLUEPRINT_IDENTIFIER_SUFFIX = '$' as const;
type BlueprintIdentifierSuffix = typeof BLUEPRINT_IDENTIFIER_SUFFIX;
export const BLUEPRINT_IDENTIFIER_REGEX = new RegExp(
  `^(${BLUEPRINT_IDENTIFIER_PREFIX})${BLUEPRINT_IDENTIFIER_SEPERATOR}\\d${BLUEPRINT_IDENTIFIER_SEPERATOR}.+\\${BLUEPRINT_IDENTIFIER_SUFFIX}$`,
);
export type BlueprintIdentifier =
  `${BlueprintIdentifierPrefix}${BlueprintIdentifierSeperator}${BlueprintIdentifierVersion}${BlueprintIdentifierSeperator}${string}${BlueprintIdentifierSuffix}`;

export const BLUEPRINT_TYPES = ['Island', 'Building'] as const;
export type Blueprint = {
  // version
  V: number;
  BP: BlueprintIsland | BlueprintBuilding;
};
export type BlueprintIsland = {
  $type: (typeof BLUEPRINT_TYPES)[0];
  Entries: Array<BlueprintIslandEntry>;
} & BlueprintInfo;
export type BlueprintIslandEntry = {
  // island layout type
  T: string;
  // relative x position
  X?: number;
  // relative y position
  Y?: number;
  R?: BlueprintEntryRotation;
  B?: BlueprintBuilding;
};
export type BlueprintBuilding = {
  $type: (typeof BLUEPRINT_TYPES)[1];
  Entries: Array<BlueprintBuildingEntry>;
} & BlueprintInfo;
export type BlueprintBuildingEntry = {
  // building identifier
  T: BlueprintBuildingIdentifier;
  // relative x position
  X?: number;
  // relative y position
  Y?: number;
  // layer
  L?: 0 | 1 | 2;
  R?: BlueprintEntryRotation;
  // Additional data
  C?: string;
};
export const BLUEPRINT_ENTRYROTATIONS = {
  East: 0,
  South: 1,
  West: 2,
  North: 3,
} as const;
type BlueprintEntryRotation =
  (typeof BLUEPRINT_ENTRYROTATIONS)[keyof typeof BLUEPRINT_ENTRYROTATIONS];
type BlueprintInfo = {
  Icon: {
    Data: Array<BlueprintIconData>;
  };
};
type BlueprintIconData = `icon:${string}` | `shape:${ShapeIdentifier}`;

export type BlueprintBuildingIdentifier =
  (typeof GAME_IDENTIFIERS)['BuildingInternalVariantIds'][number];
export type BlueprintBuildingModel = {
  base: ComponentType;
  layers?: [ComponentType, ComponentType, ComponentType];
};

const ISLAND_PADDING_SIZE = 3;
const ISLAND_GAP_SIZE = ISLAND_PADDING_SIZE * 2;
const ISLAND_MIN_SIZE = 12;
export const ISLAND_LAYOUT_UNIT = ISLAND_MIN_SIZE + ISLAND_GAP_SIZE;
export const ISLAND_LAYOUT_IDENTIFIER = [
  'Layout_1',
  'Layout_2',
  'Layout_3_L',
  'Layout_4_Quad_TwoNotches',
  'Layout_4_T',
  'Layout_5_Cross',
  'Layout_9_Quad_TopAllNotches',
] as const;
export type IslandLayoutIdentifier = (typeof ISLAND_LAYOUT_IDENTIFIER)[number];
