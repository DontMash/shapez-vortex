import { describe, expect, it } from 'vitest';
import type z from 'zod';
import type { Blueprint, BlueprintIdentifier } from './index.js';
import {
  makeBlueprintSchema,
} from './schema.js';

import { GAME_VERSION } from '@shapez-vortex/game-data';

// Minimal shape identifier validator: accepts the simple identifiers used in
// the mock data (e.g. "RuRuRuRu", "CuCuCuCu") without pulling in shape.ts.
const isShapeIdentifier = (id: string): boolean =>
  /^[CRSWFGHPc-][rgbcmykwu-]/.test(id);

const BLUEPRINT_SCHEMA = makeBlueprintSchema(isShapeIdentifier);

const mockBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62QwYrCQBBE/6XwOAdz2MscgysEFpEgQZEgzWZcB9qOzPQgIcy/70Qv+wFLQ0FTdL2iZ3SwVbX+MKj3sDNWOj0cLJrIJAMMmu9RFmNDSrBn+LLbPZNex3CPMJKY34J4o4ezbXoP+mzwKRq8i+VwRltIBocS/kXTmPSyKwnEl6pQ6r/sOnkevPz8K/0IuzY4vbR96dKkdqwbd6XEuh3Dk8LQiLogxB0FT6LIfWnnhcLUuRD9Umf5V859zr/Lq0txPgEAAA==$';
const mockInvalidBlueprintIdentifier: BlueprintIdentifier = 'SHAPEZ2-1-=$';

const mockBlueprint: Blueprint = {
  V: GAME_VERSION,
  BP: {
    $type: 'Island',
    Icon: { Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'] },
    Entries: [
      {
        R: 1,
        T: 'Foundation_1x1',
        B: {
          $type: 'Building',
          Icon: { Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'] },
          Entries: [
            { X: 0, Y: 0, R: 0, T: 'BeltDefaultForwardInternalVariant' },
          ],
        },
      },
    ],
  },
};
const createBlueprintData = (mock?: Partial<Blueprint>): Blueprint => ({
  ...mockBlueprint,
  ...mock,
});

describe('blueprint', () => {
  it('success', () => {
    const data = createBlueprintData();
    expect(() => BLUEPRINT_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure version', () => {
    const data = createBlueprintData({ V: 1 });
    expect(() => BLUEPRINT_SCHEMA.parse(data)).toThrow();
  });

  it('failure Icon Data entry format "icon"', () => {
    const data = createBlueprintData({
      BP: { ...mockBlueprint.BP, Icon: { Data: ['icon:', null, null, null] } },
    });
    expect(() => BLUEPRINT_SCHEMA.parse(data)).toThrow();
  });

  it('failure Icon Data entry format "shape"', () => {
    const data = createBlueprintData({
      BP: { ...mockBlueprint.BP, Icon: { Data: ['shape:', null, null, null] } },
    });
    expect(() => BLUEPRINT_SCHEMA.parse(data)).toThrow();
  });

  it('failure Icon Data entry invalid shape', () => {
    const data = createBlueprintData({
      BP: {
        ...mockBlueprint.BP,
        Icon: { Data: ['shape:Xx', null, null, null] },
      },
    });
    expect(() => BLUEPRINT_SCHEMA.parse(data)).toThrow();
  });
});
