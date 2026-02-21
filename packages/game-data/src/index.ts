import { GAME_VERSION } from './schemas/version.js';
import { identifiers } from './schemas/identifiers.js';
import buildingsData from './game-data/buildings.json';

export { GAME_VERSION, identifiers };

export type BuildingVariantId = (typeof identifiers.BuildingVariantIds)[number];
export type BuildingInternalVariantId = (typeof identifiers.BuildingInternalVariantIds)[number];
export type IslandLayoutId = (typeof identifiers.IslandLayoutIds)[number];
export type WikiEntryId = (typeof identifiers.WikiEntryIds)[number];
export type ImageId = (typeof identifiers.ImageIds)[number];
export type VideoId = (typeof identifiers.VideoIds)[number];
export type IconId = (typeof identifiers.IconIds)[number];

export const buildings = buildingsData;

export type * as DifficultyPreset from './schemas/DifficultyPresetSchema.js';
export type * as ScenarioParametersPreset from './schemas/ScenarioParametersPresetSchema.js';
export type * as Scenario from './schemas/ScenarioSchema.js';
