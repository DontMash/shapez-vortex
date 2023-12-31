import type { Blueprint, BlueprintString } from '$lib/blueprint.types';
import { ungzip, gzip } from 'pako';

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

export function encode(value: Blueprint): string {
    if (!isBlueprint(value)) throw new Error('Invalid blueprint');

    const content = JSON.stringify(value);
    const zipedDataArray = gzip(content);
    const zipedData = btoa(String.fromCharCode(...zipedDataArray));
    return stringify(zipedData);
};
export function isBlueprint(value: any) { return 'BP' in value && 'Entries' in value.BP && Array.isArray(value.BP.Entries) && 'V' in value; }
function stringify(value: string): string {
    const BLUEPRINT_STRING_PREFIX = 'SHAPEZ2';
    const BLUEPRINT_STRING_VERSION = 1;
    const BLUEPRINT_STRING_SEPERATOR = '-';
    const BLUEPRINT_STRING_SUFFIX = '$';

    return `${BLUEPRINT_STRING_PREFIX}${BLUEPRINT_STRING_SEPERATOR}${BLUEPRINT_STRING_VERSION}${BLUEPRINT_STRING_SEPERATOR}${value}${BLUEPRINT_STRING_SUFFIX}`;
};
