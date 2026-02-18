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
  type Blueprint,
  type BlueprintIdentifier,
} from './blueprint';
import { GAME_VERSION } from './game';

// V: 1105
const mockBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62QwYrCQBBE/6XwOAdz2MscgysEFpEgQZEgzWZcB9qOzPQgIcy/70Qv+wFLQ0FTdL2iZ3SwVbX+MKj3sDNWOj0cLJrIJAMMmu9RFmNDSrBn+LLbPZNex3CPMJKY34J4o4ezbXoP+mzwKRq8i+VwRltIBocS/kXTmPSyKwnEl6pQ6r/sOnkevPz8K/0IuzY4vbR96dKkdqwbd6XEuh3Dk8LQiLogxB0FT6LIfWnnhcLUuRD9Umf5V859zr/Lq0txPgEAAA==$';
// V: 1100
const mockOldBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62QwWrDQAxE/2XocQ/xoZc9mrRgKCWYYhqCCaLetAuqHHa1FGP23ysnl35AEQwIoXkjrRjgm2a3c2gP8CsedLkGeHSZSSY4dB+zbIM9KcGfEK33Bya9zOk7w0lhvgvyF12D78u9MFaHJ9EUQ7bFFb2RHN7M/IWWuej51RyIz41R2r/stkSeonz+K/0d3o483rS/6ZakDaz7cKHC+jynH0pTJxqSEA+UIomijpYuCqVlCCnHLY7967HWsdZfUA+i7T4BAAA=$';
const mockBuildingBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAzWOPQvCQBBE/8tgeUVS2FwZo5BORIIiKRZz6sKxCfeBhHD/3VyCLDxYhmHejBa6LIu9QnWGnrEL02igUUW2PcsbCs1zkBzVFAj6AV5+/c89lERrN8B/aDT6ELdDlxSOEhwbvxRn3KALhfvKy8prnjI21OZF0YbT4L7k+kaCcUK2JcckAalb9FjITa1xnrNOdk7pBz72cBi/AAAA$';
const mockIslandBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAyWMwQrCMBBE/2XwmIM5eNmjqNBbEfEipSw2YiBuSrMBS8i/GykDA4/hTcEdZO3+YHDsQQU7XWcHQpcCywSD7hnlP5xYGfSAb0x9YH3F5ZNgJIewFdKbZ0fXvAVDNTiLLt6lJhbc2u0lZplYfZTRfi3qUOsPrNdn7oMAAAA=$';
const mockInvalidBlueprintIdentifier: BlueprintIdentifier = 'SHAPEZ2-1-=$';
const mockInvalidBlueprintIdentifierContent: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAAytJLS4BAAx+f9gEAAAA$';
const mockBlueprint: Blueprint = {
  V: 1105,
  BP: {
    $type: 'Island',
    Icon: {
      Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'],
    },
    Entries: [
      {
        R: 1,
        T: 'Layout_Normal_1',
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
          BinaryVersion: 1105,
        },
      },
    ],
  },
};
const mockBuildingBlueprint: Blueprint = {
  V: 1105,
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
    BinaryVersion: 1105,
  },
};
const mockIslandBlueprint: Blueprint = {
  V: 1105,
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
    const result = update(mockOldBlueprintIdentifier);
    expect(result).toBe(mockBlueprintIdentifier);
  });

  it('success island blueprint', () => {
    const result = update(mockIslandBlueprintIdentifier);
    expect(result).toBe(mockIslandBlueprintIdentifier);
  });

  it('success building blueprint', () => {
    const result = update(mockBuildingBlueprintIdentifier);
    expect(result).toStrictEqual(mockBuildingBlueprintIdentifier);
  });

  it('failure invalid data', () => {
    expect(() => update('test' as BlueprintIdentifier)).toThrow();
  });

  it('failure invalid blueprint identifier', () => {
    expect(() => update(mockInvalidBlueprintIdentifier)).toThrow();
  });

  it('failure invalid content', () => {
    expect(() => update(mockInvalidBlueprintIdentifierContent)).toThrow();
  });

  it('failure invalid version', () => {
    expect(() => update(mockBlueprintIdentifier, GAME_VERSION - 1)).toThrow();
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
    const result = encode(mockBlueprint);
    expect(result).toStrictEqual(mockBlueprintIdentifier);
  });

  it('success building blueprint', () => {
    const result = encode(mockBuildingBlueprint);
    expect(result).toStrictEqual(mockBuildingBlueprintIdentifier);
  });

  it('failure invalid data', () => {
    expect(() => encode({} as Blueprint)).toThrow();
  });
});

describe('isBlueprint', () => {
  it('success', () => {
    const result = isBlueprint(mockBlueprint);
    expect(result).toBe(true);
  });

  it('success island blueprint', () => {
    const result = isBlueprint(mockIslandBlueprint);
    expect(result).toBe(true);
  });

  it('success building blueprint', () => {
    const result = isBlueprint(mockBuildingBlueprint);
    expect(result).toBe(true);
  });

  it('failure', () => {
    const result = isBlueprint({});
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
