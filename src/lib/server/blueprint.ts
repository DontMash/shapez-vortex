import { ungzip, gzip } from 'pako';
import { z } from 'zod';
import {
    GAME_VERSION,
    type Blueprint,
    type BlueprintIdentifier,
    type BlueprintBuilding,
    type BlueprintIsland,
    BLUEPRINT_EMPTY_DATA,
    BLUEPRINT_IDENTIFIER_PREFIX,
    BLUEPRINT_IDENTIFIER_SEPERATOR,
    BLUEPRINT_IDENTIFIER_SUFFIX,
    BLUEPRINT_IDENTIFIER_VERSION,
    BLUEPRINT_IDENTIFIER_REGEX,
    BLUEPRINT_TYPES,
} from '$lib/blueprint.types';

const BLUEPRINT_SCHEMA = z.object({
    V: z.number(),
    BP: z.object({
        '$type': z.enum(BLUEPRINT_TYPES),
        Entries: z.any().array(),
    }),
});

export function update(value: BlueprintIdentifier, version: number = GAME_VERSION): BlueprintIdentifier {
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
};
function parse(value: BlueprintIdentifier): string {
    if (!isBlueprintIdentifier(value)) throw new Error('Invalid blueprint identifier');

    const trim = value.slice(0, -BLUEPRINT_IDENTIFIER_SUFFIX.length);
    const data = trim.split(BLUEPRINT_IDENTIFIER_SEPERATOR)[2];
    return data;
};
export function isBlueprintIdentifier(value: BlueprintIdentifier): boolean {
    return BLUEPRINT_IDENTIFIER_REGEX.test(value);
};
export function encode(value: Blueprint): BlueprintIdentifier {
    if (!isBlueprint(value)) throw new Error('Invalid blueprint');

    const blueprint = fix(value);
    const content = JSON.stringify(blueprint);
    const zipedDataArray = gzip(content);
    const zipedData = btoa(String.fromCharCode(...zipedDataArray));
    return stringify(zipedData) as BlueprintIdentifier;
};
export function isBlueprint(value: unknown) {
    const validation = BLUEPRINT_SCHEMA.safeParse(value);
    return validation.success;
}
function stringify(value: string): string {
    return `${BLUEPRINT_IDENTIFIER_PREFIX}${BLUEPRINT_IDENTIFIER_SEPERATOR}${BLUEPRINT_IDENTIFIER_VERSION}${BLUEPRINT_IDENTIFIER_SEPERATOR}${value}${BLUEPRINT_IDENTIFIER_SUFFIX}`;
};

function fix(value: Blueprint): Blueprint {
    const bp = value.BP.$type === 'Island' ? fixBlueprintIsland(value.BP) : fixBlueprintBuilding(value.BP);
    return { ...value, BP: bp };
}
function fixBlueprintIsland(value: BlueprintIsland): BlueprintIsland {
    const entries = value.Entries.map(entry => ({ ...entry, B: fixBlueprintBuilding(entry.B) }));
    return { ...value, Entries: entries };
}
function fixBlueprintBuilding(value: BlueprintBuilding): BlueprintBuilding {
    const entries = value.Entries.map(entry => {
        switch (entry.T) {
            case 'TrainStationLoaderInternalVariant':
            case 'TrainStationUnloaderInternalVariant':
                return { ...entry, C: BLUEPRINT_EMPTY_DATA };

            default:
                return entry;
        }
    });
    return { ...value, Entries: entries };
}

export function getBuildingCount(blueprint: Blueprint): number {
    if (blueprint.BP.$type === 'Island') {
        return blueprint.BP.Entries.reduce<number>((previousIsland, currentIsland) => {
            return previousIsland + currentIsland.B.Entries.length;
        }, 0);
    }
    return blueprint.BP.Entries.length;
}
export function getIslandCount(blueprint: Blueprint): number {
    if (blueprint.BP.$type === 'Building') {
        return 0;
    }
    return blueprint.BP.Entries.length;
}
export function getCost(buildingCount: number): number {
    return buildingCount <= 1 ? 0 : Math.ceil(Math.pow(buildingCount - 1, 1.3));
}
