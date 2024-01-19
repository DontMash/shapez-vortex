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
} from '$lib/shape.types';

const SHAPE_LAYER_IDENTIFIER_SEPERATOR = ':';
const SHAPE_QUARTER_REGEX = /(..?)/g;
const SHAPE_QUARTER_PARAMETERS_REGEX = /(.?)/g;
const SHAPE_IDENTIFIER_REGEX = /^([CRSWPc-][rgbcpykwu-]){1,4}(:([CRSWPc-][rgbcpykwu-]){1,4}){0,3}$/;

export const isShapeIdentifier = (identifier: ShapeIdentifier): boolean => !!identifier.match(SHAPE_IDENTIFIER_REGEX);
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
        const layerData: ShapeLayerData = {
            layerIdentifier,
            quarters,
        };
        return layerData;
    });
    return { layers };
};
export function stringify(shape: Shape): ShapeIdentifier {
    return shape.layers.reduce<ShapeIdentifier>((resultLayer, currentLayer, index) => {
        const layerIdentifier = stringifyLayer(currentLayer);
        return index === 0 ? layerIdentifier : `${resultLayer}:${layerIdentifier}`;
    }, '');
}
function stringifyLayer(layer: ShapeLayerData): ShapeIdentifier {
    return layer.quarters.reduce<ShapeIdentifier>((resultQuarter, currentQuarter) => {
        return resultQuarter + stringifyQuarter(currentQuarter);
    }, '');
}
function stringifyQuarter(quarter: ShapeQuarterData): string {
    return quarter.type + quarter.color;
}
export function random(types: Readonly<Array<ShapeTypeIdentifier>> = SHAPE_TYPE_IDENTIFIERS, colors: Readonly<Array<ShapeColor>> = SHAPE_COLORS): ShapeIdentifier {
    let identifier: ShapeIdentifier = '';
    const layerCount = Math.round(Math.random() * (SHAPE_MAX_LAYERS - 1)) + 1;
    for (let i = 0; i < layerCount; i++) {
        if (i > 0) {
            identifier += SHAPE_LAYER_IDENTIFIER_SEPERATOR;
        }
        for (let i = 0; i < SHAPE_MAX_QUARTERS; i++) {
            const typeIndex = Math.round(Math.random() * (types.length - 1));
            const type = types[typeIndex];
            identifier += type;

            if (type === 'P' || type === '-') {
                identifier += '-';
                continue;
            }

            const colorChance = 0.7;
            const hasColor = Math.random() < colorChance;
            if (type === 'c' || hasColor) {
                const colorIndex = Math.round(Math.random() * (colors.length - 1));
                identifier += colors[colorIndex];
            }
            else {
                identifier += 'u';
            }
        }
    }
    const shape = parse(identifier);
    const newShape = simulate(shape);
    return stringify(newShape);
}
export function simulate(shape: Shape): Shape {
    const newShape: Shape = structuredClone(shape);
    shape.layers.slice(1).forEach((layer, layerIndex) => {
        layer.quarters.forEach((quarter, quarterIndex) => {
            if (quarter.type === '-') return;

            const nextLowerQuarter = newShape.layers[layerIndex].quarters[quarterIndex];
            if (nextLowerQuarter.type !== '-') return;

            function dropQuarter() {
                let i = layerIndex;
                for (; i >= 0; i--) {
                    const lowerQuarter = newShape.layers[i].quarters[quarterIndex];
                    if (lowerQuarter.type !== '-') break;
                }
                const oldQuarter = newShape.layers[layerIndex + 1].quarters[quarterIndex];
                oldQuarter.type = '-';
                oldQuarter.color = '-';
                const newQuarter = newShape.layers[i + 1].quarters[quarterIndex];
                newQuarter.type = quarter.type;
                newQuarter.color = quarter.color;
            }

            if (quarter.type === 'P') {
                dropQuarter();
                return;
            }

            const nextIndex = (SHAPE_MAX_QUARTERS + quarterIndex + 1) % SHAPE_MAX_QUARTERS;
            const nextQuarter = newShape.layers[layerIndex].quarters[nextIndex];
            if (nextQuarter.type !== '-') return;

            const previousIndex = (SHAPE_MAX_QUARTERS + quarterIndex - 1) % SHAPE_MAX_QUARTERS;
            const previousQuarter = newShape.layers[layerIndex].quarters[previousIndex];
            if (previousQuarter.type !== '-') return;

            dropQuarter();
        });
    });
    return newShape;
}

export function getTypes(shape: Shape): Set<ShapeType> {
    return shape.layers.reduce<Set<ShapeType>>((previousLayer, currentLayer) => {
        const types = currentLayer.quarters.reduce<Set<ShapeType>>((previousQuarter, currentQuarter) => {
            if (currentQuarter.type !== '-') {
                previousQuarter.add(currentQuarter.type);
            }
            return previousQuarter;
        }, new Set());
        return new Set([...previousLayer, ...types]);
    }, new Set());
}
export function getColors(shape: Shape): Set<ShapeColor> {
    return shape.layers.reduce<Set<ShapeColor>>((previousLayer, currentLayer) => {
        const colors = currentLayer.quarters.reduce<Set<ShapeColor>>((previousQuarter, currentQuarter) => {
            if (currentQuarter.color !== 'u' && currentQuarter.color !== '-') {
                previousQuarter.add(currentQuarter.color);
            }
            return previousQuarter;
        }, new Set());
        return new Set([...previousLayer, ...colors]);
    }, new Set());
}
export function getLayerCount(shape: Shape): number {
    return shape.layers.reduce<number>((perviousLayer, currentLayer) =>
        perviousLayer + Number(currentLayer.quarters.length > 0), 0);
}
export function getQuarterCount(shape: Shape): number {
    return shape.layers.reduce<number>((perviousLayer, currentLayer) => {
        return perviousLayer + currentLayer.quarters.reduce<number>((previousQuarter, currentQuarter) => {
            if (currentQuarter.type === '-') {
                return previousQuarter;
            }
            return previousQuarter + 1;
        }, 0);
    }, 0);
}
