import { z } from 'zod';

export type ShapeData = {
  identifier: ShapeIdentifier;
  data: Shape;
  meta: {
    types: Set<ShapeType>;
    colors: Set<ShapeColor>;
    layerCount: number;
    partCount: number;
  };
};

export type ShapeIdentifier = string;
const SHAPE_SUPPORT_TYPES = ['P', 'c'] as const;
export const SHAPE_DEFAULT_TYPES = ['C', 'R', 'S', 'W'] as const;
export type ShapeDefaultType = (typeof SHAPE_DEFAULT_TYPES)[number];
export const SHAPE_DEFAULT_TYPE_IDENTIFIERS = [
  ...SHAPE_DEFAULT_TYPES,
  ...SHAPE_SUPPORT_TYPES,
] as const;
export type ShapeDefaultTypeIdentifier =
  (typeof SHAPE_DEFAULT_TYPE_IDENTIFIERS)[number];
export const SHAPE_HEX_TYPES = ['F', 'G', 'H'] as const;
export type ShapeHexTypes = (typeof SHAPE_HEX_TYPES)[number];
export const SHAPE_HEX_TYPE_IDENTIFIER = [
  ...SHAPE_HEX_TYPES,
  ...SHAPE_SUPPORT_TYPES,
] as const;
export type ShapeHexTypeIdentifier = (typeof SHAPE_HEX_TYPE_IDENTIFIER)[number];
export type ShapeType = ShapeDefaultType | ShapeHexTypes;
export const SHAPE_TYPE_IDENTIFIER = [
  ...SHAPE_DEFAULT_TYPE_IDENTIFIERS,
  ...SHAPE_HEX_TYPE_IDENTIFIER,
  '-',
] as const;
export type ShapeTypeIdentifier = (typeof SHAPE_TYPE_IDENTIFIER)[number];
export const SHAPE_COLORS = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'] as const;
export type ShapeColor = (typeof SHAPE_COLORS)[number];
export const SHAPE_COLOR_IDENTIFIERS = [...SHAPE_COLORS, 'u', '-'] as const;
export type ShapeColorIdentifier = (typeof SHAPE_COLOR_IDENTIFIERS)[number];
export type Shape = Array<ShapeLayerData>;
export type ShapeLayerData = Array<ShapePartData>;
export type ShapePartData = {
  type: ShapeTypeIdentifier;
  color: ShapeColorIdentifier;
};
export const SHAPE_LAYER_IDENTIFIER_SEPERATOR = ':';
export const SHAPE_PART_REGEX = /(..?)/g;
export const SHAPE_PART_PARAMETERS_REGEX = /(.?)/g;

export const SHAPE_MAX_LAYERS = 6;
export const SHAPE_MAX_DEFAULT_PARTS = 4;
export const SHAPE_MAX_HEX_PARTS = 6;
const SHAPE_DEFAULT_PART_REGEX = `[CRSWPc-]`;
const SHAPE_HEX_PART_REGEX = `[FGHPc-]`;
const SHAPE_COLOR_REGEX = `[rgbcmykwu-]`;
const SHAPE_DEFAULT_LAYER_REGEX = `${SHAPE_DEFAULT_PART_REGEX}${SHAPE_COLOR_REGEX}){1,${SHAPE_MAX_DEFAULT_PARTS}}`;
const SHAPE_DEFAULT_IDENTIFIER_REGEX = new RegExp(
  `^(${SHAPE_DEFAULT_LAYER_REGEX}(:(${SHAPE_DEFAULT_LAYER_REGEX})*$`,
);
const SHAPE_HEX_LAYER_REGEX = `${SHAPE_HEX_PART_REGEX}${SHAPE_COLOR_REGEX}){1,${SHAPE_MAX_HEX_PARTS}}`;
const SHAPE_HEX_IDENTIFIER_REGEX = new RegExp(
  `^(${SHAPE_HEX_LAYER_REGEX}(:(${SHAPE_HEX_LAYER_REGEX})*$`,
);
export const isDefaultShapeIdentifier = (
  identifier: ShapeIdentifier,
): boolean =>
  z.string().regex(SHAPE_DEFAULT_IDENTIFIER_REGEX).safeParse(identifier)
    .success;
export const isHexShapeIdentifier = (identifier: ShapeIdentifier): boolean =>
  z.string().regex(SHAPE_HEX_IDENTIFIER_REGEX).safeParse(identifier).success;
export const isShapeIdentifier = (identifier: ShapeIdentifier): boolean => {
  const a = isDefaultShapeIdentifier(identifier);
  const b = isHexShapeIdentifier(identifier);
  return (a && !b) || (!a && b) || (a && b);
};

export const parse = (identifier: ShapeIdentifier): Shape => {
  if (!isShapeIdentifier(identifier)) {
    throw new Error(`Invalid shape identifier '${identifier}'`);
  }

  const layerIdentifiers: Array<ShapeIdentifier> = identifier.split(
    SHAPE_LAYER_IDENTIFIER_SEPERATOR,
  );
  const layers = layerIdentifiers.map<ShapeLayerData>((layerIdentifier) => {
    const partIdentifiers = layerIdentifier.match(SHAPE_PART_REGEX);
    const parts =
      partIdentifiers?.map<ShapePartData>((partIdentifier) => {
        const partShapeParameters = partIdentifier.match(
          SHAPE_PART_PARAMETERS_REGEX,
        );
        const partData: ShapePartData = {
          type: partShapeParameters
            ? (partShapeParameters[0] as ShapeTypeIdentifier)
            : '-',
          color: partShapeParameters
            ? (partShapeParameters[1] as ShapeColorIdentifier)
            : '-',
        };
        return partData;
      }) ?? [];
    const layerData: ShapeLayerData = parts;
    return layerData;
  });
  return layers;
};
export function stringify(shape: Shape): ShapeIdentifier {
  return shape.reduce<ShapeIdentifier>((resultLayer, currentLayer, index) => {
    const layerIdentifier = stringifyLayer(currentLayer);
    return index === 0 ? layerIdentifier : `${resultLayer}:${layerIdentifier}`;
  }, '');
}
function stringifyLayer(layer: ShapeLayerData): ShapeIdentifier {
  return layer.reduce<ShapeIdentifier>((resultPart, currentPart) => {
    return resultPart + stringifyPart(currentPart);
  }, '');
}
function stringifyPart(part: ShapePartData): string {
  return part.type + part.color;
}
const isHex = (types: Readonly<Array<ShapeTypeIdentifier>>): boolean => {
  return types.reduce((result, current) => {
    return result || !!SHAPE_HEX_TYPES.find((value) => value === current);
  }, false);
};

type RandomOptions = {
  types?: Readonly<Array<ShapeTypeIdentifier>>;
  colors?: Readonly<Array<ShapeColor>>;
};
export function random(options: RandomOptions): ShapeIdentifier {
  const {
    types = Math.random() < 0.5
      ? SHAPE_DEFAULT_TYPE_IDENTIFIERS
      : SHAPE_HEX_TYPE_IDENTIFIER,
    colors = SHAPE_COLORS,
  } = options;
  const layerCount = Math.round(Math.random() * (SHAPE_MAX_LAYERS - 1));
  let identifier: ShapeIdentifier = randomLayer({ types, colors });
  for (let i = 0; i < layerCount; i++) {
    identifier += `:${randomLayer({ types, colors })}`;
  }
  const shape = parse(identifier);
  const validatedShape = validate(shape);
  const simulatedShape = simulate(validatedShape);
  return stringify(simulatedShape);
}
function randomLayer(options: Required<RandomOptions>): ShapeIdentifier {
  const { types } = options;
  let layerIdentifier: ShapeIdentifier = '';
  const partCount = isHex(types)
    ? SHAPE_MAX_HEX_PARTS
    : SHAPE_MAX_DEFAULT_PARTS;
  for (let i = 0; i < partCount; i++) {
    layerIdentifier += randomPart(options);
  }
  return layerIdentifier;
}
function randomPart(options: Required<RandomOptions>): ShapeIdentifier {
  const { types, colors } = options;
  const type = randomType(types);
  const color = randomColor(type, colors);
  return type + color;
}
function randomType(
  types: Readonly<Array<ShapeTypeIdentifier>>,
): ShapeTypeIdentifier {
  const typeIndex = Math.round(Math.random() * (types.length - 1));
  return types[typeIndex];
}
function randomColor(
  type: ShapeTypeIdentifier,
  colors: Readonly<Array<ShapeColor>>,
): ShapeColorIdentifier {
  if (!isRigid(type)) return '-';

  const colorChance = 0.7;
  const hasColor = Math.random() < colorChance;
  if (type === 'c' || hasColor) {
    const colorIndex = Math.round(Math.random() * (colors.length - 1));
    return colors[colorIndex];
  } else {
    return 'u';
  }
}

function validate(shape: Shape): Shape {
  let newShape: Shape = structuredClone(shape);
  shape.forEach((_, layerIndex) => {
    newShape = validateLayer(newShape, layerIndex);
  });
  return newShape;
}
function validateLayer(shape: Shape, layerIndex: number): Shape {
  let newShape: Shape = structuredClone(shape);
  const layer = newShape[layerIndex];
  layer.forEach((_, partIndex) => {
    newShape = validatePart(newShape, layerIndex, partIndex);
  });
  return newShape;
}
function validatePart(
  shape: Shape,
  layerIndex: number,
  partIndex: number,
): Shape {
  const part = shape[layerIndex][partIndex];
  if (part.type !== 'c') return shape;

  const lowerIndex = layerIndex - 1;
  if (lowerIndex >= 0) {
    const lowerPart = shape[layerIndex - 1][partIndex];
    if (
      !isPartFloating(shape, layerIndex, partIndex) &&
      isRigid(lowerPart.type)
    ) {
      return shape;
    }
  }

  const index = shape.findIndex((_, indexLayer) => {
    const bottomPart = shape[indexLayer][partIndex];
    return !isRigid(bottomPart.type) || indexLayer >= layerIndex;
  });
  if (index < 0) return shape;

  return swapPart(shape, layerIndex, partIndex, index, partIndex);
}

function simulate(shape: Shape): Shape {
  let newShape: Shape = structuredClone(shape);
  shape.forEach((_, layerIndex) => {
    if (layerIndex < 1) return;

    newShape = simulateLayer(shape, layerIndex);
  });
  return newShape;
}
function simulateLayer(shape: Shape, layerIndex: number): Shape {
  let newShape: Shape = structuredClone(shape);
  const layer = shape[layerIndex];
  layer.forEach((_, partIndex) => {
    newShape = simulatePart(newShape, layerIndex, partIndex);
  });
  return newShape;
}
function simulatePart(
  shape: Shape,
  layerIndex: number,
  partIndex: number,
): Shape {
  const drop = (): Shape => {
    const newShape = dropPart(shape, layerIndex, partIndex);
    return newShape;
  };

  const part = shape[layerIndex][partIndex];
  if (!isSolid(part.type)) {
    return shape;
  }
  if (!isPartFloating(shape, layerIndex, partIndex)) {
    return shape;
  }
  if (part.type === 'P') {
    return drop();
  }

  const nextIndex =
    (SHAPE_MAX_DEFAULT_PARTS + partIndex + 1) % SHAPE_MAX_DEFAULT_PARTS;
  const previousIndex =
    (SHAPE_MAX_DEFAULT_PARTS + partIndex - 1) % SHAPE_MAX_DEFAULT_PARTS;
  const isNextConnected = isPartConnected(shape, layerIndex, nextIndex);
  const isPreviousConnected = isPartConnected(shape, layerIndex, previousIndex);
  if (!isNextConnected && !isPreviousConnected) {
    return drop();
  }

  const isNextFloating = isPartFloating(shape, layerIndex, nextIndex);
  if (isNextConnected && !isNextFloating) {
    return shape;
  }
  const isPreviousFloating = isPartFloating(shape, layerIndex, previousIndex);
  if (isPreviousConnected && !isPreviousFloating) {
    return shape;
  }
  const oppositeIndex = (partIndex + 2) % SHAPE_MAX_DEFAULT_PARTS;
  const isOppositeConnected = isPartConnected(shape, layerIndex, oppositeIndex);
  const isOppositeFloating = isPartFloating(shape, layerIndex, oppositeIndex);
  if (isOppositeConnected && !isOppositeFloating) {
    return shape;
  }

  return drop();
}

function isRigid(type: ShapeTypeIdentifier): boolean {
  return type !== 'P' && isSolid(type);
}
function isSolid(type: ShapeTypeIdentifier): boolean {
  return type !== '-';
}
function isPartFloating(
  shape: Shape,
  layerIndex: number,
  partIndex: number,
): boolean {
  const lowerIndex = layerIndex - 1;
  if (lowerIndex < 0) {
    return false;
  }
  const lowerPart = shape[layerIndex - 1][partIndex];
  return !isSolid(lowerPart.type);
}
function isPartConnected(
  shape: Shape,
  layerIndex: number,
  partIndex: number,
): boolean {
  const part = shape[layerIndex][partIndex];
  return !!part && isRigid(part.type);
}
function swapPart(
  shape: Shape,
  oldLayerIndex: number,
  oldPartIndex: number,
  newLayerIndex: number,
  newPartIndex: number,
) {
  const newShape: Shape = structuredClone(shape);
  const oldPart = newShape[oldLayerIndex][oldPartIndex];
  const newPart = newShape[newLayerIndex][newPartIndex];
  const type = oldPart.type;
  const color = oldPart.color;
  oldPart.type = newPart.type;
  oldPart.color = newPart.color;
  newPart.type = type;
  newPart.color = color;
  return newShape;
}
function dropPart(shape: Shape, layerIndex: number, partIndex: number): Shape {
  const index = shape.findLastIndex((layer, indexLayer) => {
    if (layerIndex <= indexLayer) return false;

    const part = layer[partIndex];
    return isSolid(part.type);
  });
  return setPart(shape, layerIndex, partIndex, index + 1, partIndex);
}
function setPart(
  shape: Shape,
  oldLayerIndex: number,
  oldPartIndex: number,
  newLayerIndex: number,
  newPartIndex: number,
): Shape {
  const newShape: Shape = structuredClone(shape);
  const oldPart = newShape[oldLayerIndex][oldPartIndex];
  const newPart = newShape[newLayerIndex][newPartIndex];
  const type = oldPart.type;
  const color = oldPart.color;
  oldPart.type = '-';
  oldPart.color = '-';
  newPart.type = type;
  newPart.color = color;
  return newShape;
}

export function getTypes(shape: Shape): Set<ShapeType> {
  return shape.reduce<Set<ShapeType>>((previousLayer, currentLayer) => {
    const types = currentLayer.reduce<Set<ShapeType>>(
      (previousPart, currentPart) => {
        switch (currentPart.type) {
          case 'C':
          case 'R':
          case 'S':
          case 'W':
          case 'F':
          case 'G':
          case 'H':
            previousPart.add(currentPart.type);
            break;
        }
        return previousPart;
      },
      new Set(),
    );
    return new Set([...previousLayer, ...types]);
  }, new Set());
}
export function getColors(shape: Shape): Set<ShapeColor> {
  return shape.reduce<Set<ShapeColor>>((previousLayer, currentLayer) => {
    const colors = currentLayer.reduce<Set<ShapeColor>>(
      (previousPart, currentPart) => {
        if (currentPart.color !== 'u' && currentPart.color !== '-') {
          previousPart.add(currentPart.color);
        }
        return previousPart;
      },
      new Set(),
    );
    return new Set([...previousLayer, ...colors]);
  }, new Set());
}
export function getLayerCount(shape: Shape): number {
  return shape.reduce<number>(
    (perviousLayer, currentLayer) =>
      perviousLayer + Number(currentLayer.length > 0),
    0,
  );
}
export function getPartCount(shape: Shape): number {
  return shape.reduce<number>((perviousLayer, currentLayer) => {
    return (
      perviousLayer +
      currentLayer.reduce<number>((previousPart, currentPart) => {
        if (currentPart.type === '-') {
          return previousPart;
        }
        return previousPart + 1;
      }, 0)
    );
  }, 0);
}
