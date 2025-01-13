import { z } from 'zod';

export const SCENARIO_TITLE_MIN = 3;
export const SCENARIO_TITLE_MAX = 64;
const SCENARTIO_TITLE_REGEX = new RegExp(
	`^[\\w-\\s]{${SCENARIO_TITLE_MIN},${SCENARIO_TITLE_MAX}}$`
);
const SCENARIO_TITLE_SCHEMA = z
	.string()
	.min(SCENARIO_TITLE_MIN)
	.max(SCENARIO_TITLE_MAX)
	.regex(SCENARTIO_TITLE_REGEX);

const SCENARIO_DATA_SCHEMA = z
	.instanceof(File)
	.refine((value) => value.size > 0, 'Empty file')
	.refine((value) => value.type === 'application/json', 'Accepted file format: application/json');

const SCENARIO_IMAGE_MAX_FILE_SIZE = 1_048_576;
const SCENARIO_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;
const SCENARIO_IMAGES_MAX = 4;
const SCENARIO_IMAGES_SCHEMA = z
	.instanceof(File)
	.refine((value) => value.size > 0, 'Empty file')
	.refine(
		(value) => value.size < SCENARIO_IMAGE_MAX_FILE_SIZE,
		`Max. image size is ${SCENARIO_IMAGE_MAX_FILE_SIZE / 1024 / 1024}MB.`
	)
	.refine(
		(value) => !!SCENARIO_IMAGE_TYPES.find((type) => type === value.type),
		`Accepted image formats are: ${SCENARIO_IMAGE_TYPES.join(', ')}`
	)
	.array()
	.max(SCENARIO_IMAGES_MAX);

const SCENARIO_TAG_MIN = 3;
const SCENARIO_TAG_MAX = 24;
const SCENARIO_TAG_REGEX = new RegExp(`[\\w-]{${SCENARIO_TAG_MIN},${SCENARIO_TAG_MAX}}`);
const SCENARIO_TAGS_MAX = 8;
const SCENARIO_TAGS_SCHEMA = z
	.string()
	.min(SCENARIO_TAG_MIN)
	.max(SCENARIO_TAG_MAX)
	.regex(SCENARIO_TAG_REGEX)
	.array()
	.max(SCENARIO_TAGS_MAX);

const SCENARIO_DESCRIPTION_MAX = 2048;
const SCENARIO_DESCRIPTION_SCHEMA = z.string().max(SCENARIO_DESCRIPTION_MAX);

export const SCENARIO_SCHEMA = z.object({
	title: SCENARIO_TITLE_SCHEMA,
	data: SCENARIO_DATA_SCHEMA,
	images: SCENARIO_IMAGES_SCHEMA.optional(),
	tags: SCENARIO_TAGS_SCHEMA.optional(),
	description: SCENARIO_DESCRIPTION_SCHEMA.optional()
});
