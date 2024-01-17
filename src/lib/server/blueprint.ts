import { GAME_VERSION, type Blueprint, type BlueprintString, type BlueprintBuilding, type BlueprintIsland, BLUEPRINT_EMPTY_DATA } from '$lib/blueprint.types';
import { ungzip, gzip } from 'pako';

export function update(value: BlueprintString, version: number = GAME_VERSION): BlueprintString {
    const blueprint = decode(value);
    blueprint.V = version;
    const identifier = encode(blueprint);
    return identifier;
}
export function decode(value: BlueprintString): Blueprint {
    const data = parse(value);
    const gzipedData = atob(data);
    const gzipedDataArray = Uint8Array.from(gzipedData, (c) => c.charCodeAt(0));
    const ungzipedData = ungzip(gzipedDataArray);
    const content = new TextDecoder().decode(ungzipedData);
    return JSON.parse(content);
};
function parse(value: BlueprintString): string {
    if (!isBlueprintString(value)) throw new Error('Invalid blueprint string');

    const BLUEPRINT_STRING_SEPERATOR = '-';
    const BLUEPRINT_STRING_SUFFIX = '$';

    const trim = value.slice(0, -BLUEPRINT_STRING_SUFFIX.length);
    const data = trim.split(BLUEPRINT_STRING_SEPERATOR)[2];
    return data;
};
export function isBlueprintString(value: BlueprintString): boolean {
    const regex = /^(SHAPEZ2)-\d-.+\$$/;
    return regex.test(value);
};
export function encode(value: Blueprint): BlueprintString {
    if (!isBlueprint(value)) throw new Error('Invalid blueprint');

    const blueprint = fix(value);
    const content = JSON.stringify(blueprint);
    const zipedDataArray = gzip(content);
    const zipedData = btoa(String.fromCharCode(...zipedDataArray));
    return stringify(zipedData) as BlueprintString;
};
export function isBlueprint(value: any) { return 'BP' in value && 'Entries' in value.BP && Array.isArray(value.BP.Entries) && 'V' in value; }
function stringify(value: string): string {
    const BLUEPRINT_STRING_PREFIX = 'SHAPEZ2';
    const BLUEPRINT_STRING_VERSION = 1;
    const BLUEPRINT_STRING_SEPERATOR = '-';
    const BLUEPRINT_STRING_SUFFIX = '$';

    return `${BLUEPRINT_STRING_PREFIX}${BLUEPRINT_STRING_SEPERATOR}${BLUEPRINT_STRING_VERSION}${BLUEPRINT_STRING_SEPERATOR}${value}${BLUEPRINT_STRING_SUFFIX}`;
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

export function buildingCount(blueprint: Blueprint): number {
    if (blueprint.BP.$type === 'Island') {
        return blueprint.BP.Entries.reduce<number>((previousIsland, currentIsland) => {
            return previousIsland + currentIsland.B.Entries.length;
        }, 0);
    }
    return blueprint.BP.Entries.length;
}
export function islandCount(blueprint: Blueprint): number {
    if (blueprint.BP.$type === 'Building') {
        return 0;
    }
    return blueprint.BP.Entries.length;
}
export function cost(buildingCount: number): number {
    return buildingCount <= 1 ? 0 : Math.ceil(Math.pow(buildingCount - 1, 1.3));
}
