import type { BuildingIdentifier } from '$lib/building.types';

export type Blueprint = {
    // version
    V: number;
    BP: BlueprintData;
};
type BlueprintData = {
    '$type': 'Building' | 'Island';
    Entries: Array<BlueprintEntry>;
};
type BlueprintEntry = {
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

type BlueprintStringPrefix = 'SHAPEZ2';
type BlueprintStringVersion = number;
type BlueprintStringSeperator = '-';
type BlueprintStringSuffix = '$';
export type BlueprintString =
    `${BlueprintStringPrefix}${BlueprintStringSeperator}${BlueprintStringVersion}${BlueprintStringSeperator}${string}${BlueprintStringSuffix}`;
