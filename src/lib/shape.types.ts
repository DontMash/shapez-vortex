import { Material, MeshBasicMaterial, Vector3 } from 'three';
import { z } from 'zod';

export const SHAPE: ShapeIdentifier = 'CwRwCwCw:P-P-P-P-:P-P-P-P-:CcCcCcCc';

export const SHAPE_MAX_LAYERS = 4;
export const SHAPE_MAX_QUARTERS = 4;
export const SHAPE_LAYER_HEIGHT = 0.1;
export const SHAPE_QUARTER_EXPAND_OFFSET = new Vector3(0.3, 0, -0.3);
export const SHAPE_LAYER_SCALE_FACTOR = 0.24;

export const SHAPE_COLOR_BASE = 0x555555;
export const SHAPE_COLOR_NONE = 0x777777;
export const SHAPE_COLOR_PIN = 0x444450;
export const SHAPE_COLOR_RED = 0xee3333;
export const SHAPE_COLOR_GREEN = 0x00ee00;
export const SHAPE_COLOR_BLUE = 0x0000ee;
export const SHAPE_COLOR_CYAN = 0x00eeee;
export const SHAPE_COLOR_PURPLE = 0xcc00cc;
export const SHAPE_COLOR_YELLOW = 0xeeee00;
export const SHAPE_COLOR_BLACK = 0x141414;
export const SHAPE_COLOR_WHITE = 0xfafafa;

export const SHAPE_COLOR_BASE_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_BASE, vertexColors: true });
export const SHAPE_COLOR_NONE_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_NONE, vertexColors: true });
export const SHAPE_COLOR_PIN_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_PIN, vertexColors: true });
export const SHAPE_COLOR_RED_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_RED, vertexColors: true });
export const SHAPE_COLOR_GREEN_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_GREEN, vertexColors: true });
export const SHAPE_COLOR_BLUE_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_BLUE, vertexColors: true });
export const SHAPE_COLOR_CYAN_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_CYAN, vertexColors: true });
export const SHAPE_COLOR_PURPLE_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_PURPLE, vertexColors: true });
export const SHAPE_COLOR_YELLOW_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_YELLOW, vertexColors: true });
export const SHAPE_COLOR_BLACK_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_BLACK, vertexColors: true });
export const SHAPE_COLOR_WHITE_MATERIAL = new MeshBasicMaterial({ color: SHAPE_COLOR_WHITE, vertexColors: true });

export const SHAPE_COLOR_MATERIALS: Record<ShapeColorIdentifier, Material> = {
    r: SHAPE_COLOR_RED_MATERIAL,
    g: SHAPE_COLOR_GREEN_MATERIAL,
    b: SHAPE_COLOR_BLUE_MATERIAL,
    c: SHAPE_COLOR_CYAN_MATERIAL,
    m: SHAPE_COLOR_PURPLE_MATERIAL,
    y: SHAPE_COLOR_YELLOW_MATERIAL,
    k: SHAPE_COLOR_BLACK_MATERIAL,
    w: SHAPE_COLOR_WHITE_MATERIAL,
    u: SHAPE_COLOR_NONE_MATERIAL,
    '-': SHAPE_COLOR_PIN_MATERIAL
};

export type ShapeData = {
    identifier: ShapeIdentifier;
    data: Shape;
    meta: {
        types: Set<ShapeType>;
        colors: Set<ShapeColor>;
        layerCount: number;
        quarterCount: number;
    };
};

export type ShapeIdentifier = string;
export const SHAPE_TYPES = ['C', 'R', 'S', 'W', 'P', 'c'] as const;
export type ShapeType = typeof SHAPE_TYPES[number];
export const SHAPE_TYPE_IDENTIFIERS = [...SHAPE_TYPES, '-'] as const;
export type ShapeTypeIdentifier = typeof SHAPE_TYPE_IDENTIFIERS[number];
export const SHAPE_COLORS = ['r', 'g', 'b', 'c', 'm', 'y', 'k', 'w'] as const;
export type ShapeColor = typeof SHAPE_COLORS[number];
export const SHAPE_COLOR_IDENTIFIERS = [...SHAPE_COLORS, 'u', '-'] as const;
export type ShapeColorIdentifier = typeof SHAPE_COLOR_IDENTIFIERS[number];
export type Shape = Array<ShapeLayerData>;
export type ShapeLayerData = Array<ShapeQuarterData>;
export type ShapeQuarterData = {
    type: ShapeTypeIdentifier;
    color: ShapeColorIdentifier;
};

const SHAPE_IDENTIFIER_REGEX = /^([CRSWPc-][rgbcmykwu-]){1,4}(:([CRSWPc-][rgbcmykwu-]){1,4}){0,3}$/;
export const isShapeIdentifier = (identifier: ShapeIdentifier): boolean => z.string().regex(SHAPE_IDENTIFIER_REGEX).safeParse(identifier).success;
