import { ungzip, gzip } from 'pako';

enum BlueprintEntryRotation {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}
type BlueprintEntry = {
    // unknown
    C: string;
    // layer
    L: 0 | 1 | 2;
    // rotation
    R: BlueprintEntryRotation;
    // building identifier
    T: string;
    // relative x position
    X: number;
    // relative y position
    Y: number;
};
export type Blueprint = {
    BP: {
        Entries: Array<BlueprintEntry>;
    };
    V: number;
};
type BlueprintStringPrefix = 'SHAPEZ2';
type BlueprintStringVersion = number;
type BlueprintStringSeperator = '-';
type BlueprintStringSuffix = '$';
export type BlueprintString =
    `${BlueprintStringPrefix}${BlueprintStringSeperator}${BlueprintStringVersion}${BlueprintStringSeperator}${string}${BlueprintStringSuffix}`;

export const decode = (value: BlueprintString): Blueprint => {
    const data = parse(value);
    const gzipedData = atob(data);
    const gzipedDataArray = Uint8Array.from(gzipedData, (c) => c.charCodeAt(0));
    const ungzipedData = ungzip(gzipedDataArray);
    const content = new TextDecoder().decode(ungzipedData);
    return JSON.parse(content);
};
const parse = (value: BlueprintString): string => {
    if (!isBlueprintString(value)) throw new Error('invalid blueprint string');

    const BLUEPRINT_STRING_SEPERATOR = '-';
    const BLUEPRINT_STRING_SUFFIX = '$';

    const trim = value.slice(0, -BLUEPRINT_STRING_SUFFIX.length);
    const data = trim.split(BLUEPRINT_STRING_SEPERATOR)[2];
    return data;
};
export const isBlueprintString = (value: BlueprintString): boolean => {
    const regex = /^(SHAPEZ2)-\d-.+\$$/;
    return regex.test(value);
};

export const encode = (value: Blueprint): string => {
    if (!isBlueprint(value)) throw new Error('invalid blueprint');

    const content = JSON.stringify(value);
    const zipedDataArray = gzip(content);
    const zipedData = btoa(String.fromCharCode(...zipedDataArray));
    return stringify(zipedData);
};
export const isBlueprint = (value: any) => 'BP' in value && 'Entries' in value.BP && Array.isArray(value.BP.Entries) && 'V' in value;
const stringify = (value: string): string => {
    const BLUEPRINT_STRING_PREFIX = 'SHAPEZ2';
    const BLUEPRINT_STRING_VERSION = 1;
    const BLUEPRINT_STRING_SEPERATOR = '-';
    const BLUEPRINT_STRING_SUFFIX = '$';

    return `${BLUEPRINT_STRING_PREFIX}${BLUEPRINT_STRING_SEPERATOR}${BLUEPRINT_STRING_VERSION}${BLUEPRINT_STRING_SEPERATOR}${value}${BLUEPRINT_STRING_SUFFIX}`;
};
