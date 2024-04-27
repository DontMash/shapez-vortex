import {
    type ShapeColorIdentifier,
    type Shape,
    type ShapeIdentifier,
    type ShapeLayerData,
    type ShapeQuarterData,
    type ShapeTypeIdentifier,
    type ShapeColor,
    type ShapeType,
    SHAPE_COLORS,
    SHAPE_TYPE_IDENTIFIERS,
    SHAPE_MAX_LAYERS,
    SHAPE_MAX_QUARTERS,
    isShapeIdentifier,
} from '$lib/shape.types';

const SHAPE_LAYER_IDENTIFIER_SEPERATOR = ':';
const SHAPE_QUARTER_REGEX = /(..?)/g;
const SHAPE_QUARTER_PARAMETERS_REGEX = /(.?)/g;

export const parse = (identifier: ShapeIdentifier): Shape => {
    if (!isShapeIdentifier(identifier)) {
        throw new Error(`Invalid shape identifier '${identifier}'`);
    }

    const layerIdentifiers: Array<ShapeIdentifier> = identifier.split(SHAPE_LAYER_IDENTIFIER_SEPERATOR);
    const layers = layerIdentifiers.map<ShapeLayerData>(layerIdentifier => {
        const quarterIdentifiers = layerIdentifier.match(SHAPE_QUARTER_REGEX);
        const quarters = quarterIdentifiers?.map<ShapeQuarterData>(quarterIdentifier => {
            const quarterShapeParameters = quarterIdentifier.match(SHAPE_QUARTER_PARAMETERS_REGEX);
            const quarterData: ShapeQuarterData = {
                type: quarterShapeParameters ? quarterShapeParameters[0] as ShapeTypeIdentifier : '-',
                color: quarterShapeParameters ? quarterShapeParameters[1] as ShapeColorIdentifier : '-',
            };
            return quarterData;
        }) ?? [];
        const layerData: ShapeLayerData = quarters;
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
    return layer.reduce<ShapeIdentifier>((resultQuarter, currentQuarter) => {
        return resultQuarter + stringifyQuarter(currentQuarter);
    }, '');
}
function stringifyQuarter(quarter: ShapeQuarterData): string {
    return quarter.type + quarter.color;
}

export function random(types: Readonly<Array<ShapeTypeIdentifier>> = SHAPE_TYPE_IDENTIFIERS, colors: Readonly<Array<ShapeColor>> = SHAPE_COLORS): ShapeIdentifier {
    const layerCount = Math.round(Math.random() * (SHAPE_MAX_LAYERS - 1));
    let identifier: ShapeIdentifier = randomLayer(types, colors);
    for (let i = 0; i < layerCount; i++) {
        identifier += `:${randomLayer(types, colors)}`;
    }
    const shape = parse(identifier);
    const validatedShape = validate(shape);
    const simulatedShape = simulate(validatedShape);
    return stringify(simulatedShape);
}
function randomLayer(types: Readonly<Array<ShapeTypeIdentifier>>, colors: Readonly<Array<ShapeColor>>): ShapeIdentifier {
    let layerIdentifier: ShapeIdentifier = '';
    for (let i = 0; i < SHAPE_MAX_QUARTERS; i++) {
        layerIdentifier += randomQuarter(types, colors);
    }
    return layerIdentifier;
}
function randomQuarter(types: Readonly<Array<ShapeTypeIdentifier>>, colors: Readonly<Array<ShapeColor>>): ShapeIdentifier {
    const type = randomType(types);
    const color = randomColor(type, colors);
    return type + color;
}
function randomType(types: Readonly<Array<ShapeTypeIdentifier>>): ShapeTypeIdentifier {
    const typeIndex = Math.round(Math.random() * (types.length - 1));
    return types[typeIndex];
}
function randomColor(type: ShapeTypeIdentifier, colors: Readonly<Array<ShapeColor>>): ShapeColorIdentifier {
    if (!isRigid(type))
        return '-';

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
    layer.forEach((_, quarterIndex) => {
        newShape = validateQuarter(newShape, layerIndex, quarterIndex);
    });
    return newShape;
}
function validateQuarter(shape: Shape, layerIndex: number, quarterIndex: number): Shape {
    const quarter = shape[layerIndex][quarterIndex];
    if (quarter.type !== 'c') return shape;

    const lowerIndex = layerIndex - 1;
    if (lowerIndex >= 0) {
        const lowerQuarter = shape[layerIndex - 1][quarterIndex];
        if (!isQuarterFloating(shape, layerIndex, quarterIndex) && isRigid(lowerQuarter.type)) {
            return shape;
        }
    }

    const index = shape.findIndex((_, indexLayer) => {
        const bottomQuarter = shape[indexLayer][quarterIndex];
        return !isRigid(bottomQuarter.type) || indexLayer >= layerIndex;
    });
    if (index < 0) return shape;

    return swapQuarter(shape, layerIndex, quarterIndex, index, quarterIndex);
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
    layer.forEach((_, quarterIndex) => {
        newShape = simulateQuarter(newShape, layerIndex, quarterIndex);
    });
    return newShape;
}
function simulateQuarter(shape: Shape, layerIndex: number, quarterIndex: number): Shape {
    const drop = (): Shape => {
        const newShape = dropQuarter(shape, layerIndex, quarterIndex);
        return newShape;
    };

    const quarter = shape[layerIndex][quarterIndex];
    if (!isSolid(quarter.type)) {
        return shape;
    }
    if (!isQuarterFloating(shape, layerIndex, quarterIndex)) {
        return shape;
    }
    if (quarter.type === 'P') {
        return drop();
    }

    const nextIndex = (SHAPE_MAX_QUARTERS + quarterIndex + 1) % SHAPE_MAX_QUARTERS;
    const previousIndex = (SHAPE_MAX_QUARTERS + quarterIndex - 1) % SHAPE_MAX_QUARTERS;
    const isNextConnected = isQuarterConnected(shape, layerIndex, nextIndex);
    const isPreviousConnected = isQuarterConnected(shape, layerIndex, previousIndex);
    if (!isNextConnected && !isPreviousConnected) {
        return drop();
    }

    const isNextFloating = isQuarterFloating(shape, layerIndex, nextIndex);
    if (isNextConnected && !isNextFloating) {
        return shape;
    }
    const isPreviousFloating = isQuarterFloating(shape, layerIndex, previousIndex);
    if (isPreviousConnected && !isPreviousFloating) {
        return shape;
    }
    const oppositeIndex = (quarterIndex + 2) % SHAPE_MAX_QUARTERS;
    const isOppositeConnected = isQuarterConnected(shape, layerIndex, oppositeIndex);
    const isOppositeFloating = isQuarterFloating(shape, layerIndex, oppositeIndex);
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
function isQuarterFloating(shape: Shape, layerIndex: number, quarterIndex: number): boolean {
    const lowerIndex = layerIndex - 1;
    if (lowerIndex < 0) {
        return false;
    }
    const lowerQuarter = shape[layerIndex - 1][quarterIndex];
    return !isSolid(lowerQuarter.type);
}
function isQuarterConnected(shape: Shape, layerIndex: number, quarterIndex: number): boolean {
    const quarter = shape[layerIndex][quarterIndex];
    return (!!quarter && isRigid(quarter.type));
}
function swapQuarter(shape: Shape, oldLayerIndex: number, oldQuarterIndex: number, newLayerIndex: number, newQuarterIndex: number) {
    const newShape: Shape = structuredClone(shape);
    const oldQuarter = newShape[oldLayerIndex][oldQuarterIndex];
    const newQuarter = newShape[newLayerIndex][newQuarterIndex];
    const type = oldQuarter.type;
    const color = oldQuarter.color;
    oldQuarter.type = newQuarter.type;
    oldQuarter.color = newQuarter.color;
    newQuarter.type = type;
    newQuarter.color = color;
    return newShape;
}
function dropQuarter(shape: Shape, layerIndex: number, quarterIndex: number): Shape {
    const index = shape.findLastIndex((layer, indexLayer) => {
        if (layerIndex <= indexLayer) return false;

        const quarter = layer[quarterIndex];
        return isSolid(quarter.type);
    });
    return setQuarter(shape, layerIndex, quarterIndex, index + 1, quarterIndex);
}
function setQuarter(shape: Shape, oldLayerIndex: number, oldQuarterIndex: number, newLayerIndex: number, newQuarterIndex: number): Shape {
    const newShape: Shape = structuredClone(shape);
    const oldQuarter = newShape[oldLayerIndex][oldQuarterIndex];
    const newQuarter = newShape[newLayerIndex][newQuarterIndex];
    const type = oldQuarter.type;
    const color = oldQuarter.color;
    oldQuarter.type = '-';
    oldQuarter.color = '-';
    newQuarter.type = type;
    newQuarter.color = color;
    return newShape;
}

export function getTypes(shape: Shape): Set<ShapeType> {
    return shape.reduce<Set<ShapeType>>((previousLayer, currentLayer) => {
        const types = currentLayer.reduce<Set<ShapeType>>((previousQuarter, currentQuarter) => {
            if (currentQuarter.type !== '-') {
                previousQuarter.add(currentQuarter.type);
            }
            return previousQuarter;
        }, new Set());
        return new Set([...previousLayer, ...types]);
    }, new Set());
}
export function getColors(shape: Shape): Set<ShapeColor> {
    return shape.reduce<Set<ShapeColor>>((previousLayer, currentLayer) => {
        const colors = currentLayer.reduce<Set<ShapeColor>>((previousQuarter, currentQuarter) => {
            if (currentQuarter.color !== 'u' && currentQuarter.color !== '-') {
                previousQuarter.add(currentQuarter.color);
            }
            return previousQuarter;
        }, new Set());
        return new Set([...previousLayer, ...colors]);
    }, new Set());
}
export function getLayerCount(shape: Shape): number {
    return shape.reduce<number>((perviousLayer, currentLayer) =>
        perviousLayer + Number(currentLayer.length > 0), 0);
}
export function getQuarterCount(shape: Shape): number {
    return shape.reduce<number>((perviousLayer, currentLayer) => {
        return perviousLayer + currentLayer.reduce<number>((previousQuarter, currentQuarter) => {
            if (currentQuarter.type === '-') {
                return previousQuarter;
            }
            return previousQuarter + 1;
        }, 0);
    }, 0);
}
