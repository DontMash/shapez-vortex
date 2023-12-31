import type { ShapeColorIdentifier, ShapeData, ShapeIdentifier, ShapeLayerData, ShapeQuarterData, ShapeTypeIdentifier } from '$lib/shape.types';

const SHAPE_LAYER_IDENTIFIER_SEPERATOR = ':';
const SHAPE_QUARTER_REGEX = /(..?)/g;
const SHAPE_QUARTER_PARAMETERS_REGEX = /(.?)/g;
const SHAPE_IDENTIFIER_REGEX = /^([CRWSPc-][rgbypcwu-]){1,4}(:([CRWSPc-][rgbypcwu-]){1,4}){0,3}$/;

export const isShapeIdentifier = (identifier: ShapeIdentifier): boolean => !!identifier.match(SHAPE_IDENTIFIER_REGEX);
export const parse = (identifier: ShapeIdentifier): ShapeData => {
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
    return { identifier, layers };
};
