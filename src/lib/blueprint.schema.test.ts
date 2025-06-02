import { describe, expect, it } from 'vitest';
import type z from 'zod';
import type { Blueprint, BlueprintIdentifier } from './blueprint';
import {
  BLUEPRINT_CREATE_SCHEMA,
  BLUEPRINT_FORM_SCHEMA,
  BLUEPRINT_SCHEMA,
  type BlueprintFormData,
} from './blueprint.schema';

const mockBlueprintIdentifier: BlueprintIdentifier =
  'SHAPEZ2-1-H4sIAAAAAAAAA62QwYrCQBBE/6XwOAdz2MscgysEFpEgQZEgzWZcB9qOzPQgIcy/70Qv+wFLQ0FTdL2iZ3SwVbX+MKj3sDNWOj0cLJrIJAMMmu9RFmNDSrBn+LLbPZNex3CPMJKY34J4o4ezbXoP+mzwKRq8i+VwRltIBocS/kXTmPSyKwnEl6pQ6r/sOnkevPz8K/0IuzY4vbR96dKkdqwbd6XEuh3Dk8LQiLogxB0FT6LIfWnnhcLUuRD9Umf5V859zr/Lq0txPgEAAA==$';
const mockInvalidBlueprintIdentifier: BlueprintIdentifier = 'SHAPEZ2-1-=$';
const mockImageFile = new File(['0'], 'Test', { type: 'image/jpeg' });

const mockBlueprintFormData: BlueprintFormData = {
  title: 'test',
  data: mockBlueprintIdentifier,
};
const createBlueprintFormData = (
  mock?: Partial<BlueprintFormData>,
): BlueprintFormData => {
  return { ...mockBlueprintFormData, ...mock };
};

describe('form', () => {
  it('success', () => {
    const data = createBlueprintFormData();
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure title min length', () => {
    const data = createBlueprintFormData({ title: 'te' });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure title max length', () => {
    const data = createBlueprintFormData({
      title:
        'This is a test - This is a test - This is a test - This is a test',
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure title regex', () => {
    const data = createBlueprintFormData({ title: 'test.' });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure data', () => {
    const data = createBlueprintFormData({
      data: mockInvalidBlueprintIdentifier,
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('description success', () => {
    const data = createBlueprintFormData({
      description: '',
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure description', () => {
    const data = createBlueprintFormData({
      description:
        'This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. ',
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('success images', () => {
    const data = createBlueprintFormData({ images: [] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('success images file', () => {
    const data = createBlueprintFormData({
      images: [mockImageFile],
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure images empty file', () => {
    const data = createBlueprintFormData({
      images: [new File([], 'Test', { type: 'image/jpeg' })],
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure images file type', () => {
    const data = createBlueprintFormData({
      images: [new File(['0'], 'Test', { type: 'application/json' })],
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure images amount', () => {
    const data = createBlueprintFormData({
      images: [
        mockImageFile,
        mockImageFile,
        mockImageFile,
        mockImageFile,
        mockImageFile,
      ],
    });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('success tags', () => {
    const data = createBlueprintFormData({ tags: ['test'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('success new tags', () => {
    const data = createBlueprintFormData({ tags: ['$test'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure tags length', () => {
    const data = createBlueprintFormData({ tags: ['te'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure new tags length', () => {
    const data = createBlueprintFormData({ tags: ['$te'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure tags regex', () => {
    const data = createBlueprintFormData({ tags: ['test+'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });

  it('failure new tags regex', () => {
    const data = createBlueprintFormData({ tags: ['$test+'] });
    expect(() => BLUEPRINT_FORM_SCHEMA.parse(data)).toThrow();
  });
});

type BlueprintCreateData = z.infer<typeof BLUEPRINT_CREATE_SCHEMA>;
const mockBlueprintCreateData: BlueprintCreateData = {
  title: 'test',
  data: mockBlueprintIdentifier,
  description: '',
  images: [],
  tags: [],
  type: 'Island',
  cost: 1,
  buildings: '{"BeltDefaultForwardInternalVariant":1}',
  buildingCount: 1,
  islandCount: 1,
  creator: 'test',
  viewCount: 1,
  downloadCount: 1,
  bookmarkCount: 1,
  version: 1,
};
const createBlueprintCreateData = (
  mock?: Partial<BlueprintCreateData>,
): BlueprintCreateData => ({ ...mockBlueprintCreateData, ...mock });

describe('create', () => {
  it('success', () => {
    const data = createBlueprintCreateData();
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).not.toThrow();
  });

  it('failure title min length', () => {
    const data = createBlueprintCreateData({ title: 'te' });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure title max length', () => {
    const data = createBlueprintCreateData({
      title:
        'This is a test - This is a test - This is a test - This is a test',
    });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure title regex', () => {
    const data = createBlueprintCreateData({ title: 'test.' });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure data', () => {
    const data = createBlueprintCreateData({
      data: mockInvalidBlueprintIdentifier,
    });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure description', () => {
    const data = createBlueprintCreateData({
      description:
        'This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. ',
    });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure images empty file', () => {
    const data = createBlueprintCreateData({
      images: [new File([], 'Test', { type: 'image/jpeg' })],
    });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure images file type', () => {
    const data = createBlueprintCreateData({
      images: [new File(['0'], 'Test', { type: 'application/json' })],
    });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure cost', () => {
    const data = createBlueprintCreateData({ cost: -1 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure buildingCount', () => {
    const data = createBlueprintCreateData({ buildingCount: 0 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure islandCount', () => {
    const data = createBlueprintCreateData({ islandCount: -1 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure viewCount', () => {
    const data = createBlueprintCreateData({ viewCount: 0 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure bookmarkCount', () => {
    const data = createBlueprintCreateData({ bookmarkCount: 0 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure downloadCount', () => {
    const data = createBlueprintCreateData({ downloadCount: 0 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });

  it('failure version', () => {
    const data = createBlueprintCreateData({ version: 0 });
    expect(() => BLUEPRINT_CREATE_SCHEMA.parse(data)).toThrow();
  });
});

const mockBlueprint: Blueprint = {
  V: 1105,
  BP: {
    $type: 'Island',
    Icon: { Data: ['icon:Platforms', null, null, 'shape:RuRuRuRu'] },
    Entries: [
      {
        R: 1,
        T: 'Layout_Normal_1',
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
