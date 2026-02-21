import type { RecordModel } from 'pocketbase';
import type { z } from 'zod';
export {
  BLUEPRINT_IDENTIFIER_PREFIX,
  BLUEPRINT_IDENTIFIER_VERSION,
  BLUEPRINT_IDENTIFIER_SEPERATOR,
  BLUEPRINT_IDENTIFIER_SUFFIX,
  BLUEPRINT_IDENTIFIER_REGEX,
  getBuildingCount,
  getIslandCount,
  getBuildings,
  getCost,
  isBlueprintIdentifier,
  decode,
  type Blueprint,
  type BlueprintIdentifier,
  type BlueprintIsland,
  type BlueprintIslandEntry,
  type BlueprintBuilding,
  type BlueprintBuildingEntry,
  type BlueprintBuildingIdentifier,
} from '@shapez-vortex/blueprint';
import {
  encode as _encode,
  isBlueprint as _isBlueprint,
  update as _update,
  type Blueprint,
  type BlueprintIdentifier,
} from '@shapez-vortex/blueprint';
import {
  BLUEPRINT_RECORD_SCHEMA,
  BLUEPRINT_SCHEMA,
} from '$lib/blueprint.schema';
import { GAME_VERSION } from '@shapez-vortex/game-data';

export type BlueprintRecordData = z.infer<typeof BLUEPRINT_RECORD_SCHEMA>;
export type BlueprintRecord = RecordModel &
  BlueprintRecordData & { images: Array<string> };
export interface BlueprintTag extends RecordModel {
  name: string;
}

export function encode(value: Blueprint): BlueprintIdentifier {
  return _encode(value, BLUEPRINT_SCHEMA);
}

export function isBlueprint(value: unknown): value is Blueprint {
  return _isBlueprint(value, BLUEPRINT_SCHEMA);
}

export function update(
  value: BlueprintIdentifier,
  version: number = GAME_VERSION,
): BlueprintIdentifier {
  return _update(value, version, BLUEPRINT_SCHEMA);
}
