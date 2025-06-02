import type { RecordModel } from 'pocketbase';
import type { z } from 'zod';
import type {
  BLUEPRINT_BUILDING_ENTRY_SCHEMA,
  BLUEPRINT_BUILDING_SCHEMA,
  BLUEPRINT_ISLAND_ENTRY_SCHEMA,
  BLUEPRINT_ISLAND_SCHEMA,
  BLUEPRINT_RECORD_SCHEMA,
  BLUEPRINT_SCHEMA,
} from '$lib/blueprint.schema';

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

export type Blueprint = z.infer<typeof BLUEPRINT_SCHEMA>;
export type BlueprintIsland = z.infer<typeof BLUEPRINT_ISLAND_SCHEMA>;
export type BlueprintIslandEntry = z.infer<
  typeof BLUEPRINT_ISLAND_ENTRY_SCHEMA
>;
export type BlueprintBuilding = z.infer<typeof BLUEPRINT_BUILDING_SCHEMA>;
export type BlueprintBuildingEntry = z.infer<
  typeof BLUEPRINT_BUILDING_ENTRY_SCHEMA
>;
export type BlueprintBuildingIdentifier = string;
