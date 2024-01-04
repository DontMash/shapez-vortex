import type BUILDINGS_METADATA from '$lib/assets/data/buildings-metadata.json';

export const GAME_VERSION = 1033;

type BlueprintStringPrefix = 'SHAPEZ2';
type BlueprintStringVersion = number;
type BlueprintStringSeperator = '-';
type BlueprintStringSuffix = '$';
export type BlueprintString =
    `${BlueprintStringPrefix}${BlueprintStringSeperator}${BlueprintStringVersion}${BlueprintStringSeperator}${string}${BlueprintStringSuffix}`;

export type Blueprint = {
    // version
    V: number;
    BP: BlueprintIsland | BlueprintBuilding;
};
export type BlueprintIsland = {
    '$type': 'Island';
    Entries: Array<BlueprintIslandEntry>;
};
export type BlueprintIslandEntry = {
    // island layout type
    T: string;
    // relative x position
    X?: number;
    // relative y position
    Y?: number;
    R?: BlueprintEntryRotation;
    B: BlueprintBuilding;
};
export type BlueprintBuilding = {
    '$type': 'Building';
    Entries: Array<BlueprintBuildingEntry>;
};
export type BlueprintBuildingEntry = {
    // building identifier
    T: BuildingIdentifier;
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
const BLUEPRINT_ENTRYROTATIONS = {
    'East': 0,
    'South': 1,
    'West': 2,
    'North': 3,
} as const;
type BlueprintEntryRotation = typeof BLUEPRINT_ENTRYROTATIONS[keyof typeof BLUEPRINT_ENTRYROTATIONS];

type BuildingIntervalVariant = typeof BUILDINGS_METADATA[number]['Variants'][number]['InternalVariants'][number];
export type BuildingIdentifier = BuildingIntervalVariant['Id'];

export const BLUEPRINT_EMPTY_DATA = '//8=';
export const BLUEPRINT_GRID_SIZE = 1001;
export const BLUEPRINT_GRID_COLOR = 0x444444;

const ISLAND_PADDING_SIZE = 4;
const ISLAND_GAP_SIZE = ISLAND_PADDING_SIZE * 2;
const ISLAND_MIN_SIZE = 12;
export const ISLAND_LAYOUT_UNIT = ISLAND_MIN_SIZE + ISLAND_GAP_SIZE;
const ISLAND_LAYOUT_IDENTIFIER = ['Layout_1', 'Layout_2', 'Layout_3_L', 'Layout_4_Quad_TwoNotches', 'Layout_4_T', 'Layout_5_Cross', 'Layout_9_Quad_TopAllNotches'] as const;
export type IslandLayoutIdentifier = typeof ISLAND_LAYOUT_IDENTIFIER[number];
