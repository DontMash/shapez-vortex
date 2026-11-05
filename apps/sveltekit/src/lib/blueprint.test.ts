import { gunzipSync, gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  decode,
  encode,
  getBuildingCount,
  getBuildings,
  getCost,
  getIslandCount,
  isBlueprint,
  isBlueprintIdentifier,
  update,
} from '$lib/blueprint';
import {
  GAME_VERSION,
  type Blueprint,
  type BlueprintBuildingEntry,
  type BlueprintIdentifier,
} from '$lib/blueprint.types';
import {
  corruptBlueprintIdentifiers,
  createBlueprintCodecFixture,
} from '$tests/fixtures/blueprint-codec.fixture';

const readEncodedBlueprint = (identifier: string): unknown => {
  const payload = identifier.slice('SHAPEZ2-1-'.length, -1);
  return JSON.parse(
    gunzipSync(Buffer.from(payload, 'base64')).toString('utf8'),
  );
};

describe.each(['building', 'island'] as const)('%s blueprint codec', (kind) => {
  it('decodes an independently encoded identifier into the expected content', () => {
    const { identifier, blueprint } = createBlueprintCodecFixture(kind);

    expect(decode(identifier)).toEqual(blueprint);
  });

  it('encodes meaningful content in the version 1 envelope', () => {
    const { blueprint } = createBlueprintCodecFixture(kind);

    const identifier = encode(blueprint);

    expect(identifier).toMatch(/^SHAPEZ2-1-.+\$$/);
    expect(readEncodedBlueprint(identifier)).toEqual(blueprint);
  });

  it('serializes an empty blueprint without inventing entries', () => {
    const { blueprint } = createBlueprintCodecFixture(kind);
    blueprint.BP.Entries = [];

    expect(readEncodedBlueprint(encode(blueprint))).toEqual(blueprint);
  });

  it('round trips an independent fixture without losing content', () => {
    const { identifier, blueprint } = createBlueprintCodecFixture(kind);

    expect(decode(encode(decode(identifier)))).toEqual(blueprint);
  });

  it('updates an explicit game version and preserves the remaining content', () => {
    const { identifier, blueprint } = createBlueprintCodecFixture(kind);

    expect(readEncodedBlueprint(update(identifier, 1090))).toEqual({
      ...blueprint,
      V: 1090,
    });
  });

  it('defaults version updates to the current game version', () => {
    const { identifier, blueprint } = createBlueprintCodecFixture(kind);

    expect(readEncodedBlueprint(update(identifier))).toEqual({
      ...blueprint,
      V: GAME_VERSION,
    });
  });

  it.each([
    { type: 'TrainStationLoaderInternalVariant', data: undefined },
    { type: 'TrainStationLoaderInternalVariant', data: 'c3RhdGlvbg==' },
    { type: 'TrainStationUnloaderInternalVariant', data: undefined },
    { type: 'TrainStationUnloaderInternalVariant', data: 'c3RhdGlvbg==' },
  ])(
    'normalizes $type with C=$data without mutating the input',
    ({ type, data }) => {
      const { blueprint } = createBlueprintCodecFixture(kind);
      const building =
        blueprint.BP.$type === 'Building'
          ? blueprint.BP
          : blueprint.BP.Entries[0].B!;
      const station: BlueprintBuildingEntry = {
        T: type,
        X: -9,
        Y: 10,
        L: 2,
        R: 1,
        ...(data === undefined ? {} : { C: data }),
      };
      building.Entries.push(station);
      const original = structuredClone(blueprint);
      const expected = structuredClone(blueprint);
      const expectedBuilding =
        expected.BP.$type === 'Building'
          ? expected.BP
          : expected.BP.Entries[0].B!;
      expectedBuilding.Entries.at(-1)!.C = '//8=';

      const identifier = encode(blueprint);

      expect(readEncodedBlueprint(identifier)).toEqual(expected);
      expect(blueprint).toEqual(original);
    },
  );

  it('applies station normalization when updating a version', () => {
    const { blueprint } = createBlueprintCodecFixture(kind);
    const building =
      blueprint.BP.$type === 'Building'
        ? blueprint.BP
        : blueprint.BP.Entries[0].B!;
    building.Entries.push({
      T: 'TrainStationLoaderInternalVariant',
      X: 9,
      Y: -10,
      C: 'c3RhdGlvbg==',
    });
    const identifier: BlueprintIdentifier = `SHAPEZ2-1-${gzipSync(
      JSON.stringify(blueprint),
    ).toString('base64')}$`;
    const expected = structuredClone(blueprint);
    const expectedBuilding =
      expected.BP.$type === 'Building'
        ? expected.BP
        : expected.BP.Entries[0].B!;
    expectedBuilding.Entries.at(-1)!.C = '//8=';

    expect(readEncodedBlueprint(update(identifier, 1090))).toEqual({
      ...expected,
      V: 1090,
    });
  });
});

describe('blueprint identifier validation', () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(
    'recognizes and decodes the compatible single-digit format version %i',
    (version) => {
      const { identifier, blueprint } = createBlueprintCodecFixture('building');
      const compatible = identifier.replace(
        'SHAPEZ2-1-',
        `SHAPEZ2-${version}-`,
      );

      expect(isBlueprintIdentifier(compatible)).toBe(true);
      expect(decode(compatible as BlueprintIdentifier)).toEqual(blueprint);
    },
  );

  it.each([
    { name: 'empty input', value: '' },
    { name: 'wrong prefix', value: 'SHAPEZ-1-payload$' },
    { name: 'lowercase prefix', value: 'shapez2-1-payload$' },
    { name: 'missing prefix', value: '1-payload$' },
    { name: 'missing first separator', value: 'SHAPEZ21-payload$' },
    { name: 'missing second separator', value: 'SHAPEZ2-1payload$' },
    { name: 'missing version', value: 'SHAPEZ2--payload$' },
    { name: 'non-digit version', value: 'SHAPEZ2-x-payload$' },
    { name: 'multi-digit version', value: 'SHAPEZ2-10-payload$' },
    { name: 'empty payload', value: 'SHAPEZ2-1-$' },
    { name: 'missing suffix', value: 'SHAPEZ2-1-payload' },
    { name: 'leading space', value: ' SHAPEZ2-1-payload$' },
    { name: 'trailing space', value: 'SHAPEZ2-1-payload$ ' },
  ])('rejects $name before decoding', ({ value }) => {
    expect(isBlueprintIdentifier(value)).toBe(false);
    expect(() => decode(value as BlueprintIdentifier)).toThrowError(
      new Error('Invalid blueprint identifier'),
    );
  });

  it.each(corruptBlueprintIdentifiers)(
    'does not mistake a valid envelope for a decodable payload: $name',
    ({ identifier }) => {
      expect(isBlueprintIdentifier(identifier)).toBe(true);
      expect(() => decode(identifier)).toThrow();
      expect(() => update(identifier)).toThrow();
    },
  );
});

describe('blueprint object validation', () => {
  it.each(['building', 'island'] as const)(
    'accepts a valid %s blueprint',
    (kind) => {
      const { blueprint } = createBlueprintCodecFixture(kind);

      expect(isBlueprint(blueprint)).toBe(true);
    },
  );

  it.each(['building', 'island'] as const)(
    'accepts an empty %s blueprint',
    (kind) => {
      const { blueprint } = createBlueprintCodecFixture(kind);
      blueprint.BP.Entries = [];

      expect(isBlueprint(blueprint)).toBe(true);
    },
  );

  it.each([
    { name: 'undefined', value: undefined },
    { name: 'null', value: null },
    { name: 'an array', value: [] },
    { name: 'a primitive', value: 'blueprint' },
    { name: 'an empty object', value: {} },
    {
      name: 'missing version',
      value: { BP: { $type: 'Building', Entries: [] } },
    },
    {
      name: 'non-numeric version',
      value: { V: '1094', BP: { $type: 'Building', Entries: [] } },
    },
    { name: 'missing BP', value: { V: 1094 } },
    { name: 'non-object BP', value: { V: 1094, BP: 'Building' } },
    { name: 'missing discriminator', value: { V: 1094, BP: { Entries: [] } } },
    {
      name: 'invalid discriminator',
      value: { V: 1094, BP: { $type: 'Unknown', Entries: [] } },
    },
    { name: 'missing entries', value: { V: 1094, BP: { $type: 'Building' } } },
    {
      name: 'non-array entries',
      value: { V: 1094, BP: { $type: 'Building', Entries: {} } },
    },
  ])('rejects $name with the application-owned encode error', ({ value }) => {
    expect(isBlueprint(value)).toBe(false);
    expect(() => encode(value as Blueprint)).toThrowError(
      new Error('Invalid blueprint'),
    );
  });
});

describe('blueprint summaries', () => {
  it.each([
    { kind: 'building', buildings: 3, islands: 0 },
    { kind: 'island', buildings: 4, islands: 4 },
  ] as const)(
    'counts buildings and islands in a $kind blueprint',
    ({ kind, buildings, islands }) => {
      const { blueprint } = createBlueprintCodecFixture(kind);

      expect({
        buildings: getBuildingCount(blueprint),
        islands: getIslandCount(blueprint),
      }).toEqual({ buildings, islands });
    },
  );

  it.each([
    { kind: 'building', belts: 2 },
    { kind: 'island', belts: 3 },
  ] as const)(
    'aggregates repeated building types in a $kind blueprint',
    ({ kind, belts }) => {
      const { blueprint } = createBlueprintCodecFixture(kind);

      expect(getBuildings(blueprint)).toEqual(
        new Map([
          ['BeltDefaultForwardInternalVariant', belts],
          ['CutterDefaultInternalVariant', 1],
        ]),
      );
    },
  );

  it.each(['building', 'island'] as const)(
    'reports empty totals for an empty %s blueprint',
    (kind) => {
      const { blueprint } = createBlueprintCodecFixture(kind);
      blueprint.BP.Entries = [];

      expect({
        buildingCount: getBuildingCount(blueprint),
        islandCount: getIslandCount(blueprint),
        buildings: getBuildings(blueprint),
      }).toEqual({ buildingCount: 0, islandCount: 0, buildings: new Map() });
    },
  );

  it.each([
    { buildings: 0, cost: 0 },
    { buildings: 1, cost: 0 },
    { buildings: 2, cost: 1 },
    { buildings: 3, cost: 3 },
    { buildings: 4, cost: 5 },
    { buildings: 5, cost: 7 },
    { buildings: 10, cost: 18 },
    { buildings: 100, cost: 393 },
  ])('charges $cost for $buildings buildings', ({ buildings, cost }) => {
    expect(getCost(buildings)).toBe(cost);
  });
});
