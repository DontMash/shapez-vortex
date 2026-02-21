import { describe, expect, it } from 'vitest';
import { GAME_VERSION } from '@shapez-vortex/game-data';
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
  type Blueprint,
  type BlueprintIdentifier,
} from './index.js';
import { BLUEPRINT_SCHEMA_STATIC } from './schema.js';

// The static schema has no game-version or shape-identifier enforcement,
// which is sufficient for testing the codec functions in isolation.
const schema = BLUEPRINT_SCHEMA_STATIC;

const mockBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62QQQvCMAyF/8vDYw8Obz0OFXaTIUORIcFVLdRU2hSV0f9upxd/gAQehEfyvWREB11Vi7lCvYEeMZPX3UCjiY54gEJz8jwZSxKCPsCWXm8cydmHW4Ti5NxXEK90N7pN30KfFVYswZpYBke0haSwLcvXPvFAYj0fq2dVIPUvuk7WDZYvf4XvoMuN+4+2H52C1MbJ0pwpOVn78KAwNCwmMLmOgiUW5L6ks0zh1ZkQ7RRnelfOfc5vYXseaD0BAAA=$';
const mockOldBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62PwQrCMAyG3+XHYw/btccxhd3GEFFEJLhOCzUdXYrK2LvbbRcfQBI+CCH5khEH6DzPMoWihh6xkU9voFENjriFQnXzPDdKEoI+w6Za146k8+E5QHF0bgWGB/VGN3ENXCaFLUuwZkiDI5pkUtin5TsfuSWxnq/5O0+S4lddROtay/e/yo/Q6cfTwmbhfEhhnJSmo+hk58OLQluxmMDkDhQssWC6THN+AVfPtycoAQAA$';
const mockBuildingBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAzWOTQvCMBBE/8vgMQfFW461Cr2JSFGkh8VGXQjbkg+klPx3kxZZeLAMw7wZLfRut98qVGfoGZswjQYaVWTbs7yh0DwHKVFNgaAf4Pzrf+6hJFq7Av5Do9GHuB66pHCU4Nj4XJxxg85D94WXhdcyZWyozYuiDafBfcn1jQTjhGxLjkkCUpf1WMhNrXGei05xTukHfJ/bOb8AAAA=$';
const mockIslandBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAyWMwQrCMBBE/2XwmIPB2x5Fhd6KiBcpZbERA3FTmg1YQv7dSBkYeAxvCu4gaw97g2MPKtjpOjsQuhRYJhh0zyj/4cTKoAd8Y+oD6ysunwQjOYStkN48O7rmLRiqwVl08S41seDWbi8xy8Tqo4z2a1GHWn9f43d0gwAAAA==$';
const mockInvalidBlueprintIdentifier: BlueprintIdentifier = 'SHAPEZ2-1-=$';
const mockInvalidBlueprintIdentifierContent: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAytJLS4BAAx+f9gEAAAA$';
const mockBlueprint: Blueprint = {
  V: GAME_VERSION,
  BP: {
    $type: 'Island',
    Icon: {
      Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'],
    },
    Entries: [
      {
        R: 1,
        T: 'Foundation_1x1',
        B: {
          $type: 'Building',
          Icon: {
            Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'],
          },
          Entries: [
            {
              X: 0,
              Y: 0,
              R: 0,
              T: 'BeltDefaultForwardInternalVariant',
            },
          ],
          BinaryVersion: GAME_VERSION,
        },
      },
    ],
  },
};
const mockBuildingBlueprint: Blueprint = {
  V: GAME_VERSION,
  BP: {
    $type: 'Building',
    Icon: {
      Data: ['icon:Buildings', null, null, 'shape:CuCuCuCu'],
    },
    Entries: [
      {
        X: 0,
        Y: 0,
        R: 0,
        T: 'BeltDefaultForwardInternalVariant',
      },
    ],
    BinaryVersion: GAME_VERSION,
  },
};
const mockIslandBlueprint: Blueprint = {
  V: GAME_VERSION,
  BP: {
    $type: 'Island',
    Icon: {
      Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'],
    },
    Entries: [
      {
        T: 'Foundation_1x1',
      },
    ],
  },
};
const mockBlueprintBuildings = new Map<string, number>([
  ['BeltDefaultForwardInternalVariant', 1],
]);

describe('update', () => {
  it('success', () => {
    const expectedUpdatedIdentifier = 'SHAPEZ2-1-H4sIAAAAAAAAA62PwQrCMAyG3+XHYw8Obz0WHewmQ4YiIsFVLdR0dCkqY+9uNy8+gCR8EELyJQMa6KJYLRXMFnrAQt6dhUbVe+IWCtUl8NRYkxD0ES7XeutJriE+eihO3n+B/k6d1XX6Bk6jwoYlOtvnwQF1Nins8vIyJG5JXOBz8SqyxPyqTXK+dXz7q3wPnX88zKxnTocY62Vtr5S8lCE+KbYVi41MvqHoiAXjaZzyA8WjzcYoAQAA$';
    const result = update(mockOldBlueprintIdentifier, GAME_VERSION, schema);
    expect(result).toBe(expectedUpdatedIdentifier);
  });

  it('success island blueprint', () => {
    const result = update(mockIslandBlueprintIdentifier, GAME_VERSION, schema);
    expect(result).toBe(mockIslandBlueprintIdentifier);
  });

  it('success building blueprint', () => {
    const result = update(mockBuildingBlueprintIdentifier, GAME_VERSION, schema);
    expect(result).toStrictEqual(mockBuildingBlueprintIdentifier);
  });

  it('failure invalid data', () => {
    expect(() => update('test' as BlueprintIdentifier, GAME_VERSION, schema)).toThrow();
  });

  it('failure invalid blueprint identifier', () => {
    expect(() =>
      update(mockInvalidBlueprintIdentifier, GAME_VERSION, schema),
    ).toThrow();
  });

  it('failure invalid content', () => {
    expect(() =>
      update(mockInvalidBlueprintIdentifierContent, GAME_VERSION, schema),
    ).toThrow();
  });
});

describe('decode', () => {
  it('success', () => {
    const result = decode(mockBlueprintIdentifier);
    expect(result).toStrictEqual(mockBlueprint);
  });

  it('success island blueprint', () => {
    const result = decode(mockIslandBlueprintIdentifier);
    expect(result).toStrictEqual(mockIslandBlueprint);
  });

  it('success building blueprint', () => {
    const result = decode(mockBuildingBlueprintIdentifier);
    expect(result).toStrictEqual(mockBuildingBlueprint);
  });

  it('failure invalid data', () => {
    expect(() => decode('test' as BlueprintIdentifier)).toThrow();
  });

  it('failure invalid blueprint identifier', () => {
    expect(() => decode(mockInvalidBlueprintIdentifier)).toThrow();
  });

  it('failure invalid content', () => {
    expect(() => decode(mockInvalidBlueprintIdentifierContent)).toThrow();
  });
});

describe('isBlueprintIdentifier', () => {
  it('success valid blueprint', () => {
    const result = isBlueprintIdentifier(mockBlueprintIdentifier);
    expect(result).toBe(true);
  });

  it('success invalid blueprint', () => {
    const result = isBlueprintIdentifier(mockInvalidBlueprintIdentifier);
    expect(result).toBe(true);
  });

  it('failure invalid input', () => {
    const result = isBlueprintIdentifier('test' as BlueprintIdentifier);
    expect(result).toBe(false);
  });
});

describe('encode', () => {
  it('success island blueprint', () => {
    const result = encode(mockBlueprint, schema);
    expect(result).toStrictEqual(mockBlueprintIdentifier);
  });

  it('success building blueprint', () => {
    const result = encode(mockBuildingBlueprint, schema);
    expect(result).toStrictEqual(mockBuildingBlueprintIdentifier);
  });

  it('failure invalid data', () => {
    expect(() => encode({} as Blueprint, schema)).toThrow();
  });
});

describe('isBlueprint', () => {
  it('success', () => {
    const result = isBlueprint(mockBlueprint, schema);
    expect(result).toBe(true);
  });

  it('success island blueprint', () => {
    const result = isBlueprint(mockIslandBlueprint, schema);
    expect(result).toBe(true);
  });

  it('success building blueprint', () => {
    const result = isBlueprint(mockBuildingBlueprint, schema);
    expect(result).toBe(true);
  });

  it('failure', () => {
    const result = isBlueprint({}, schema);
    expect(result).toBe(false);
  });
});

describe('getBuildingCount', () => {
  it('success', () => {
    const result = getBuildingCount(mockBlueprint);
    expect(result).toBe(1);
  });

  it('success island blueprint', () => {
    const result = getBuildingCount(mockIslandBlueprint);
    expect(result).toBe(0);
  });

  it('success building blueprint', () => {
    const result = getBuildingCount(mockBuildingBlueprint);
    expect(result).toBe(1);
  });
});

describe('getIslandCount', () => {
  it('success island blueprint', () => {
    const result = getIslandCount(mockBlueprint);
    expect(result).toBe(1);
  });

  it('success building blueprint', () => {
    const result = getIslandCount(mockBuildingBlueprint);
    expect(result).toBe(0);
  });
});

describe('getBuildings', () => {
  it('success', () => {
    const result = getBuildings(mockBlueprint);
    expect(result).toStrictEqual(mockBlueprintBuildings);
  });

  it('success island blueprint', () => {
    const result = getBuildings(mockIslandBlueprint);
    expect(result).toStrictEqual(new Map());
  });

  it('success building blueprint', () => {
    const result = getBuildings(mockBuildingBlueprint);
    expect(result).toStrictEqual(mockBlueprintBuildings);
  });
});

describe('getCost', () => {
  it('success', () => {
    const result = getCost(2);
    expect(result).toBe(1);
  });

  it('success no cost', () => {
    const result = getCost(1);
    expect(result).toBe(0);
  });
});
