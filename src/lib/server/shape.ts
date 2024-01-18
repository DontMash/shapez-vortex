import type {
    ShapeColorIdentifier,
    Shape,
    ShapeIdentifier,
    ShapeLayerData,
    ShapeQuarterData,
    ShapeTypeIdentifier,
    ShapeColor,
    ShapeType,
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

export function types(shape: Shape): Set<ShapeType> {
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
export function colors(shape: Shape): Set<ShapeColor> {
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
export function layerCount(shape: Shape): number {
    return shape.layers.reduce<number>((perviousLayer, currentLayer) =>
        perviousLayer + Number(currentLayer.quarters.length > 0), 0);
}
export function quarterCount(shape: Shape): number {
    return shape.layers.reduce<number>((perviousLayer, currentLayer) => {
        return perviousLayer + currentLayer.quarters.reduce<number>((previousQuarter, currentQuarter) => {
            if (currentQuarter.type === '-') {
                return previousQuarter;
            }
            return previousQuarter + 1;
        }, 0);
    }, 0);
}
