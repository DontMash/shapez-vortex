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
	.refine((value) => value.type !== 'application/json', 'Accepted file format: application/json');

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
	tags: SCENARIO_TAGS_SCHEMA.optional(),
	description: SCENARIO_DESCRIPTION_SCHEMA.optional()
});
