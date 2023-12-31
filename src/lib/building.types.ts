import type BUILDINGS_METADATA from '$lib/assets/data/buildings-metadata.json';

type BuildingIntervalVariant = typeof BUILDINGS_METADATA[number]['Variants'][number]['InternalVariants'][number];
export type BuildingIdentifier = BuildingIntervalVariant['Id'];

export const GRID_SIZE = 101;
export const GRID_COLOR = 0x444444;
