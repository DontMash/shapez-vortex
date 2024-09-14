import { Material, MeshStandardMaterial } from 'three';
import { z } from 'zod';

export const SHAPE: ShapeIdentifier = 'CwRwCwCw:P-P-P-P-:P-P-P-P-:CcCcCcCc';

export const SHAPE_MAX_LAYERS = 4;
export const SHAPE_MAX_DEFAULT_PARTS = 4;
export const SHAPE_MAX_HEX_PARTS = 6;

export const SHAPE_COLOR_BASE = 0x333333;
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

const SHAPE_COLOR_MATERIAL_OPTIONS = {
	vertexColors: true,
	roughness: 0.7,
	metalness: 0.1
};
export const SHAPE_COLOR_BASE_MATERIAL = new MeshStandardMaterial({
	name: 'BASE_MATERIAL',
	color: SHAPE_COLOR_BASE,
	roughness: 0.8,
	metalness: 0.3
});
export const SHAPE_COLOR_NONE_MATERIAL = new MeshStandardMaterial({
	name: 'NONE_MATERIAL',
	color: SHAPE_COLOR_NONE,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_PIN_MATERIAL = new MeshStandardMaterial({
	name: 'PIN_MATERIAL',
	color: SHAPE_COLOR_PIN,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_RED_MATERIAL = new MeshStandardMaterial({
	name: 'RED_MATERIAL',
	color: SHAPE_COLOR_RED,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_GREEN_MATERIAL = new MeshStandardMaterial({
	name: 'GREEN_MATERIAL',
	color: SHAPE_COLOR_GREEN,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_BLUE_MATERIAL = new MeshStandardMaterial({
	name: 'BLUE_MATERIAL',
	color: SHAPE_COLOR_BLUE,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_CYAN_MATERIAL = new MeshStandardMaterial({
	name: 'CYAN_MATERIAL',
	color: SHAPE_COLOR_CYAN,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_PURPLE_MATERIAL = new MeshStandardMaterial({
	name: 'PURPLE_MATERIAL',
	color: SHAPE_COLOR_PURPLE,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_YELLOW_MATERIAL = new MeshStandardMaterial({
	name: 'YELLOW_MATERIAL',
	color: SHAPE_COLOR_YELLOW,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_BLACK_MATERIAL = new MeshStandardMaterial({
	name: 'BLACK_MATERIAL',
	color: SHAPE_COLOR_BLACK,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_WHITE_MATERIAL = new MeshStandardMaterial({
	name: 'WHITE_MATERIAL',
	color: SHAPE_COLOR_WHITE,
	...SHAPE_COLOR_MATERIAL_OPTIONS
});
export const SHAPE_COLOR_MATERIALS: Record<ShapeColorIdentifier, Material> = {
	r: SHAPE_COLOR_RED_MATERIAL,
	g: SHAPE_COLOR_GREEN_MATERIAL,
	b: SHAPE_COLOR_BLUE_MATERIAL,
	c: SHAPE_COLOR_CYAN_MATERIAL,
	p: SHAPE_COLOR_PURPLE_MATERIAL,
	y: SHAPE_COLOR_YELLOW_MATERIAL,
	k: SHAPE_COLOR_BLACK_MATERIAL,
	w: SHAPE_COLOR_WHITE_MATERIAL,
	u: SHAPE_COLOR_NONE_MATERIAL,
	'-': SHAPE_COLOR_PIN_MATERIAL
};

const SHAPE_CRYSTAL_MATERIAL_OPTIONS = {
	roughness: 0.2,
	metalness: 0.6
};
export const SHAPE_CRYSTAL_NONE_MATERIAL = new MeshStandardMaterial({
	name: 'NONE_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_NONE,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_RED_MATERIAL = new MeshStandardMaterial({
	name: 'RED_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_RED,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_GREEN_MATERIAL = new MeshStandardMaterial({
	name: 'GREEN_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_GREEN,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_BLUE_MATERIAL = new MeshStandardMaterial({
	name: 'BLUE_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_BLUE,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_CYAN_MATERIAL = new MeshStandardMaterial({
	name: 'CYAN_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_CYAN,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_PURPLE_MATERIAL = new MeshStandardMaterial({
	name: 'PURPLE_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_PURPLE,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_YELLOW_MATERIAL = new MeshStandardMaterial({
	name: 'YELLOW_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_YELLOW,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_BLACK_MATERIAL = new MeshStandardMaterial({
	name: 'BLACK_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_BLACK,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_WHITE_MATERIAL = new MeshStandardMaterial({
	name: 'WHITE_CRYSTAL_MATERIAL',
	color: SHAPE_COLOR_WHITE,
	...SHAPE_CRYSTAL_MATERIAL_OPTIONS
});
export const SHAPE_CRYSTAL_MATERIALS: Record<ShapeColorIdentifier, Material> = {
	r: SHAPE_CRYSTAL_RED_MATERIAL,
	g: SHAPE_CRYSTAL_GREEN_MATERIAL,
	b: SHAPE_CRYSTAL_BLUE_MATERIAL,
	c: SHAPE_CRYSTAL_CYAN_MATERIAL,
	p: SHAPE_CRYSTAL_PURPLE_MATERIAL,
	y: SHAPE_CRYSTAL_YELLOW_MATERIAL,
	k: SHAPE_CRYSTAL_BLACK_MATERIAL,
	w: SHAPE_CRYSTAL_WHITE_MATERIAL,
	u: SHAPE_CRYSTAL_NONE_MATERIAL,
	'-': SHAPE_COLOR_NONE_MATERIAL
};

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
	...SHAPE_SUPPORT_TYPES
] as const;
export type ShapeDefaultTypeIdentifier = (typeof SHAPE_DEFAULT_TYPE_IDENTIFIERS)[number];
export const SHAPE_HEX_TYPES = ['F', 'G', 'H'] as const;
export type ShapeHexTypes = (typeof SHAPE_HEX_TYPES)[number];
export const SHAPE_HEX_TYPE_IDENTIFIER = [...SHAPE_HEX_TYPES, ...SHAPE_SUPPORT_TYPES] as const;
export type ShapeHexTypeIdentifier = (typeof SHAPE_HEX_TYPE_IDENTIFIER)[number];
export type ShapeType = ShapeDefaultType | ShapeHexTypes;
export const SHAPE_TYPE_IDENTIFIER = [
	...SHAPE_DEFAULT_TYPE_IDENTIFIERS,
	...SHAPE_HEX_TYPE_IDENTIFIER,
	'-'
] as const;
export type ShapeTypeIdentifier = (typeof SHAPE_TYPE_IDENTIFIER)[number];
export const SHAPE_COLORS = ['r', 'g', 'b', 'c', 'p', 'y', 'k', 'w'] as const;
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

const SHAPE_DEFAULT_IDENTIFIER_REGEX =
	/^([CRSWPc-][rgbcpykwu-]){1,4}(:([CRSWPc-][rgbcpykwu-]){1,4}){0,3}$/;
const SHAPE_HEX_IDENTIFIER_REGEX =
	/^([FGHPc-][rgbcpykwu-]){1,6}(:([FGHPc-][rgbcpykwu-]){1,6}){0,3}$/;
export const isDefaultShapeIdentifier = (identifier: ShapeIdentifier): boolean =>
	z.string().regex(SHAPE_DEFAULT_IDENTIFIER_REGEX).safeParse(identifier).success;
export const isHexShapeIdentifier = (identifier: ShapeIdentifier): boolean =>
	z.string().regex(SHAPE_HEX_IDENTIFIER_REGEX).safeParse(identifier).success;
export const isShapeIdentifier = (identifier: ShapeIdentifier): boolean => {
	const a = isDefaultShapeIdentifier(identifier);
	const b = isHexShapeIdentifier(identifier);
	return (a && !b) || (!a && b) || (a && b);
};
