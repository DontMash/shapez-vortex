import type {
  Shape,
  ShapeColor,
  ShapeIdentifier,
  ShapeType,
} from '$lib/shape.types';

export const acceptedShapeIdentifiers: Array<{
  identifier: ShapeIdentifier;
  isDefault: boolean;
  isHex: boolean;
}> = [
  { identifier: 'Cr', isDefault: true, isHex: false },
  { identifier: 'CwRwCwCw', isDefault: true, isHex: false },
  { identifier: 'Cr:Cr:Cr:Cr:Cr:Cr', isDefault: true, isHex: false },
  { identifier: 'CrRu:Wb', isDefault: true, isHex: false },
  { identifier: 'Fr', isDefault: false, isHex: true },
  { identifier: 'FrGrHbFuGuHu', isDefault: false, isHex: true },
  { identifier: 'Fr:Gu', isDefault: false, isHex: true },
  { identifier: 'P-c---', isDefault: true, isHex: true },
  { identifier: 'P-P-P-P-', isDefault: true, isHex: true },
  { identifier: 'P-P-P-P-P-', isDefault: false, isHex: true },
];

export const rejectedShapeIdentifiers: Array<{
  name: string;
  identifier: ShapeIdentifier;
}> = [
  { name: 'empty input', identifier: '' },
  { name: 'incomplete pair', identifier: 'C' },
  { name: 'leading separator', identifier: ':Cr' },
  { name: 'trailing separator', identifier: 'Cr:' },
  { name: 'empty layer', identifier: 'Cr::Ru' },
  { name: 'mixed parts in one layer', identifier: 'CrFr' },
  { name: 'mixed layers', identifier: 'Cr:Fr' },
  { name: 'five default parts', identifier: 'CrCrCrCrCr' },
  { name: 'seven hex parts', identifier: 'FrGrHbFuGuHuHr' },
  { name: 'unknown type', identifier: 'Xr' },
  { name: 'unknown color', identifier: 'Cz' },
  { name: 'uppercase color', identifier: 'CR' },
  { name: 'trailing space', identifier: 'Cr ' },
];

export const shapeParseFixtures: Array<{
  identifier: ShapeIdentifier;
  expected: Shape;
}> = [
  {
    identifier: 'CrRu:Wb',
    expected: [
      [
        { type: 'C', color: 'r' },
        { type: 'R', color: 'u' },
      ],
      [{ type: 'W', color: 'b' }],
    ],
  },
  {
    identifier: 'CwRwCwCw:P-P-P-P-',
    expected: [
      [
        { type: 'C', color: 'w' },
        { type: 'R', color: 'w' },
        { type: 'C', color: 'w' },
        { type: 'C', color: 'w' },
      ],
      [
        { type: 'P', color: '-' },
        { type: 'P', color: '-' },
        { type: 'P', color: '-' },
        { type: 'P', color: '-' },
      ],
    ],
  },
  {
    identifier: 'FrGrHbFuGuHu',
    expected: [
      [
        { type: 'F', color: 'r' },
        { type: 'G', color: 'r' },
        { type: 'H', color: 'b' },
        { type: 'F', color: 'u' },
        { type: 'G', color: 'u' },
        { type: 'H', color: 'u' },
      ],
    ],
  },
];

export const shapeSummaryFixtures: Array<{
  identifier: ShapeIdentifier;
  types: Array<ShapeType>;
  colors: Array<ShapeColor>;
  layerCount: number;
  partCount: number;
}> = [
  {
    identifier: 'CrRu:Wb',
    types: ['C', 'R', 'W'],
    colors: ['b', 'r'],
    layerCount: 2,
    partCount: 3,
  },
  {
    identifier: 'CrP-Wbcr:--',
    types: ['C', 'W'],
    colors: ['b', 'r'],
    layerCount: 2,
    partCount: 4,
  },
  {
    identifier: 'RuCu',
    types: ['C', 'R'],
    colors: [],
    layerCount: 1,
    partCount: 2,
  },
  {
    identifier: '----:--',
    types: [],
    colors: [],
    layerCount: 2,
    partCount: 0,
  },
];
