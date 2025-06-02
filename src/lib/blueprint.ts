import { ungzip, gzip } from 'pako';
import type { RecordModel } from 'pocketbase';
import type { z } from 'zod';
import {
  BLUEPRINT_BUILDING_ENTRY_SCHEMA,
  BLUEPRINT_BUILDING_SCHEMA,
  BLUEPRINT_ISLAND_ENTRY_SCHEMA,
  BLUEPRINT_ISLAND_SCHEMA,
  BLUEPRINT_RECORD_SCHEMA,
  BLUEPRINT_SCHEMA,
} from '$lib/blueprint.schema';
import { GAME_VERSION } from '$lib/game';

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

export function update(
  value: BlueprintIdentifier,
  version: number = GAME_VERSION,
): BlueprintIdentifier {
  const blueprint = decode(value);
  blueprint.V = version;
  const identifier = encode(blueprint);
  return identifier;
}
export function decode(value: BlueprintIdentifier): Blueprint {
  const data = parse(value);
  const gzipedData = atob(data);
  const gzipedDataArray = Uint8Array.from(gzipedData, (c) => c.charCodeAt(0));
  const ungzipedData = ungzip(gzipedDataArray);
  const content = new TextDecoder().decode(ungzipedData);
  return JSON.parse(content);
}
function parse(value: BlueprintIdentifier): string {
  if (!isBlueprintIdentifier(value))
    throw new Error('Invalid blueprint identifier');

  const trim = value.slice(0, -BLUEPRINT_IDENTIFIER_SUFFIX.length);
  const data = trim.split(BLUEPRINT_IDENTIFIER_SEPERATOR)[2];
  return data;
}
export function isBlueprintIdentifier(
  value: string,
): value is BlueprintIdentifier {
  return BLUEPRINT_IDENTIFIER_REGEX.test(value);
}
export function encode(value: Blueprint): BlueprintIdentifier {
  if (!isBlueprint(value)) throw new Error('Invalid blueprint');

  const content = JSON.stringify(value);
  const zipedDataArray = gzip(content);
  const zipedData = btoa(String.fromCharCode(...zipedDataArray));
  return stringify(zipedData) as BlueprintIdentifier;
}
export function isBlueprint(value: unknown): value is Blueprint {
  const validation = BLUEPRINT_SCHEMA.safeParse(value);
  return validation.success;
}
function stringify(value: string): string {
  return `${BLUEPRINT_IDENTIFIER_PREFIX}${BLUEPRINT_IDENTIFIER_SEPERATOR}${BLUEPRINT_IDENTIFIER_VERSION}${BLUEPRINT_IDENTIFIER_SEPERATOR}${value}${BLUEPRINT_IDENTIFIER_SUFFIX}`;
}

export function getBuildingCount(blueprint: Blueprint): number {
  if (blueprint.BP.$type === 'Island') {
    return blueprint.BP.Entries.reduce<number>(
      (previousIsland, currentIsland) => {
        return previousIsland + (currentIsland.B?.Entries.length ?? 0);
      },
      0,
    );
  }
  return blueprint.BP.Entries.length;
}
export function getIslandCount(blueprint: Blueprint): number {
  if (blueprint.BP.$type === 'Building') {
    return 0;
  }
  return blueprint.BP.Entries.length;
}
export function getBuildings(
  blueprint: Blueprint,
): Map<BlueprintBuildingIdentifier, number> {
  if (blueprint.BP.$type === 'Island') {
    return blueprint.BP.Entries.reduce<
      Map<BlueprintBuildingIdentifier, number>
    >((result, current) => {
      if (!current.B) {
        return result;
      }
      getBuildingTypes(current.B).forEach((value, key) =>
        result.set(key, (result.get(key) ?? 0) + value),
      );
      return result;
    }, new Map());
  }
  return getBuildingTypes(blueprint.BP);
}
function getBuildingTypes(
  blueprint: BlueprintBuilding,
): Map<BlueprintBuildingIdentifier, number> {
  return blueprint.Entries.reduce<Map<BlueprintBuildingIdentifier, number>>(
    (result, current) => {
      result.set(current.T, (result.get(current.T) ?? 0) + 1);
      return result;
    },
    new Map(),
  );
}
export function getCost(buildingCount: number): number {
  return buildingCount <= 1 ? 0 : Math.ceil(Math.pow(buildingCount - 1, 1.3));
}
