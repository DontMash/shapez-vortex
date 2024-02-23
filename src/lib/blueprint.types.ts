import type { RecordModel } from 'pocketbase';
import { z } from 'zod';

import type BUILDINGS_METADATA from '$lib/assets/data/buildings-metadata.json';

export const GAME_VERSION = 1033;

export const BLUEPRINT_FILE_FORMAT = '.spz2bp' as const;
export const BLUEPRINT_EMPTY_DATA = '//8=';
export const BLUEPRINT_GRID_SIZE = 1001;
export const BLUEPRINT_GRID_COLOR = 0x444444;

/**
 * buildings as json-string of @type {Record<BuildingIdentifier, number>}
 */
export interface BlueprintData extends RecordModel {
    title: string,
    description: string,
    images: Array<string>,
    tags: Array<string>,
    data: BlueprintIdentifier,
    type: BlueprintType,
    cost: number,
    // Record<BuildingIdentifier, number> as json-string
    buildings: string,
    buildingCount: number,
    islandCount: number,
    creator: string,
    bookmarkCount: number,
    downloadCount: number,
    version: number,
}
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
export const BLUEPRINT_IDENTIFIER_REGEX = new RegExp(`^(${BLUEPRINT_IDENTIFIER_PREFIX})${BLUEPRINT_IDENTIFIER_SEPERATOR}\\d${BLUEPRINT_IDENTIFIER_SEPERATOR}.+\\${BLUEPRINT_IDENTIFIER_SUFFIX}$`);
export type BlueprintIdentifier =
    `${BlueprintIdentifierPrefix}${BlueprintIdentifierSeperator}${BlueprintIdentifierVersion}${BlueprintIdentifierSeperator}${string}${BlueprintIdentifierSuffix}`;

export const BLUEPRINT_TITLE_MIN_LENGTH = 3;
export const BLUEPRINT_TITLE_MAX_LENGTH = 64;
export const BLUEPRINT_TITLE_REGEX = new RegExp(`^[A-Za-z0-9-_\\s]{${BLUEPRINT_TITLE_MIN_LENGTH},${BLUEPRINT_TITLE_MAX_LENGTH}}$`);
const BLUEPRINT_DESCRIPTION_MAX_LENGTH = 2048;
export const BLUEPRINT_TAG_MIN_LENGTH = 3;
export const BLUEPRINT_TAG_MAX_LENGTH = 16;
export const BLUEPRINT_TAGS_MAX = 8;
export const BLUEPRINT_TAGS_REGEX = new RegExp(`^\\s*(\\w{${BLUEPRINT_TAG_MIN_LENGTH},${BLUEPRINT_TAG_MAX_LENGTH}}(\\s*,+\\s*\\w{${BLUEPRINT_TAG_MIN_LENGTH},${BLUEPRINT_TAG_MAX_LENGTH}})*)?\\s*$`);
export const BLUEPRINT_IMAGE_MAX_FILE_SIZE = 1048576;
const BLUEPRINT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;
type BlueprintImageType = typeof BLUEPRINT_IMAGE_TYPES[number];
export const BLUEPRINT_IMAGES_MAX = 4;
export const BLUEPRINT_UPLOAD_FORM_SCHEMA = z.object({
    title: z.string().regex(BLUEPRINT_TITLE_REGEX),
    description: z.string().max(BLUEPRINT_DESCRIPTION_MAX_LENGTH).optional(),
    data: z.custom<BlueprintIdentifier>(data => BLUEPRINT_IDENTIFIER_REGEX.test(data as string)),
    images: z.custom<Array<File>>(data => {
        const files = data as Array<File>;
        return files.length <= BLUEPRINT_IMAGES_MAX;
    }, `Max image amount is ${BLUEPRINT_IMAGES_MAX}`)
        .refine(files =>
            files.reduce<boolean>((result, current) =>
                result && current.size <= BLUEPRINT_IMAGE_MAX_FILE_SIZE, true),
            `Max image size is ${BLUEPRINT_IMAGE_MAX_FILE_SIZE / 1024 / 1024}MB.`)
        .refine(files =>
            files.reduce<boolean>((result, current) =>
                result && (!current.name || BLUEPRINT_IMAGE_TYPES.includes(current.type as BlueprintImageType)), true),
            `Accepted image formats are: ${BLUEPRINT_IMAGE_TYPES.join(', ')}`)
        .optional(),
    tags: z.string()
        .regex(BLUEPRINT_TAGS_REGEX)
        .transform(value => {
            const tags = value.replace(/\s+/gi, '').toLocaleLowerCase().split(',').filter(tag => tag.length !== 0).slice(0, BLUEPRINT_TAGS_MAX);
            return new Set(tags);
        })
        .optional(),
});

export const BLUEPRINT_TYPES = ['Island', 'Building'] as const;
type BlueprintType = typeof BLUEPRINT_TYPES[number];
export type Blueprint = {
    // version
    V: number;
    BP: BlueprintIsland | BlueprintBuilding;
};
export type BlueprintIsland = {
    '$type': typeof BLUEPRINT_TYPES[0];
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
    '$type': typeof BLUEPRINT_TYPES[1];
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

const ISLAND_PADDING_SIZE = 4;
const ISLAND_GAP_SIZE = ISLAND_PADDING_SIZE * 2;
const ISLAND_MIN_SIZE = 12;
export const ISLAND_LAYOUT_UNIT = ISLAND_MIN_SIZE + ISLAND_GAP_SIZE;
const ISLAND_LAYOUT_IDENTIFIER = ['Layout_1', 'Layout_2', 'Layout_3_L', 'Layout_4_Quad_TwoNotches', 'Layout_4_T', 'Layout_5_Cross', 'Layout_9_Quad_TopAllNotches'] as const;
export type IslandLayoutIdentifier = typeof ISLAND_LAYOUT_IDENTIFIER[number];
