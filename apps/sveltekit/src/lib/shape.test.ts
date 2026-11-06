import { describe, expect, it } from 'vitest';
import {
  getColors,
  getLayerCount,
  getPartCount,
  getTypes,
  parse,
  stringify,
} from '$lib/shape';
import {
  isDefaultShapeIdentifier,
  isHexShapeIdentifier,
  isShapeIdentifier,
  type Shape,
} from '$lib/shape.types';
import {
  acceptedShapeIdentifiers,
  rejectedShapeIdentifiers,
  shapeParseFixtures,
  shapeSummaryFixtures,
} from '$tests/fixtures/shape.fixture';

describe('shape identifier recognition', () => {
  it.each(acceptedShapeIdentifiers)(
    'recognizes $identifier as default=$isDefault hex=$isHex',
    ({ identifier, isDefault, isHex }) => {
      expect(isDefaultShapeIdentifier(identifier)).toBe(isDefault);
      expect(isHexShapeIdentifier(identifier)).toBe(isHex);
      expect(isShapeIdentifier(identifier)).toBe(true);
    },
  );

  it.each(rejectedShapeIdentifiers)(
    'rejects $name as an identifier',
    ({ identifier }) => {
      expect(isDefaultShapeIdentifier(identifier)).toBe(false);
      expect(isHexShapeIdentifier(identifier)).toBe(false);
      expect(isShapeIdentifier(identifier)).toBe(false);
    },
  );
});

describe('shape parsing and stringification', () => {
  it.each(shapeParseFixtures)(
    'parses $identifier into explicit part data and round trips',
    ({ identifier, expected }) => {
      const shape = parse(identifier);

      expect(shape).toEqual(expected);
      expect(stringify(shape)).toBe(identifier);
    },
  );

  it.each(rejectedShapeIdentifiers)(
    'throws the application error for $name',
    ({ identifier }) => {
      expect(() => parse(identifier)).toThrowError(
        new Error(`Invalid shape identifier '${identifier}'`),
      );
    },
  );

  it('serializes structurally empty data without validation', () => {
    expect(stringify([])).toBe('');
    expect(stringify([[], []])).toBe(':');
  });

  it('does not mutate the shape while stringifying or summarizing', () => {
    const shape = parse('CrP-Wbcr:--');
    const original = structuredClone(shape);

    expect(stringify(shape)).toBe('CrP-Wbcr:--');
    expect([...getTypes(shape)].map(String).sort()).toEqual(['C', 'W']);
    expect([...getColors(shape)].map(String).sort()).toEqual(['b', 'r']);
    expect(getLayerCount(shape)).toBe(2);
    expect(getPartCount(shape)).toBe(4);
    expect(shape).toEqual(original);
  });
});

describe('shape summaries', () => {
  it.each(shapeSummaryFixtures)(
    'summarizes $identifier explicitly',
    ({ identifier, types, colors, layerCount, partCount }) => {
      const shape = parse(identifier);

      expect([...getTypes(shape)].map(String).sort()).toEqual(types);
      expect([...getColors(shape)].map(String).sort()).toEqual(colors);
      expect(getLayerCount(shape)).toBe(layerCount);
      expect(getPartCount(shape)).toBe(partCount);
    },
  );

  it('summarizes structurally empty layers as zero', () => {
    const shape: Shape = [[], []];

    expect([...getTypes(shape)].map(String).sort()).toEqual([]);
    expect([...getColors(shape)].map(String).sort()).toEqual([]);
    expect(getLayerCount(shape)).toBe(0);
    expect(getPartCount(shape)).toBe(0);
  });
});
