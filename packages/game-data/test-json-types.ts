import data from './src/game-data/identifiers.json' with { type: "json" };
export type First = typeof data.BuildingVariantIds[0];
const test: First = "some_random_string";
