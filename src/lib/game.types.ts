import type { Progression } from '$lib/progression.types';
import type { ShapeColor, ShapeIdentifier } from '$lib/shape.types';

import GAME_METADATA from '$lib/assets/data/game-metadata.json';

export const WIKI_ENTRIES = [...GAME_METADATA['WikiEntryIds']] as const;
export type WikiEntryId = typeof WIKI_ENTRIES[number];
export const BUILDINGS_VARIANTS = [...GAME_METADATA['BuildingVariantIds']] as const;
export type BuildingVariantId = typeof BUILDINGS_VARIANTS[number];
export const MECHANICS = [...GAME_METADATA['UnlockableMechanicIds']] as const;
export type MechanicId = typeof MECHANICS[number];
export const ISLAND_LAYOUTS = [...GAME_METADATA['IslandLayoutIds']] as const;
export type LayoutId = typeof ISLAND_LAYOUTS[number];

export type TranslationString = `@${string}` | string;
export type Scenario = {
    FormatVersion: number;
    GameVersion: number;
    UniqueId: string;
    SupportedGameModes: Array<string>;
    Title: TranslationString;
    Description: TranslationString;
    ExampleShapes: Array<ShapeIdentifier>;
    Config: ScenarioConfig;
    Progression: Progression;
    StartingLocation: ScenarioStartingLocation;
};
type ScenarioConfig = {
    BaseChunkLimitMultiplier: number;
    LayerMechanicIds: Array<string>;
    BlueprintsMechanicId: string;
    RailsMechanicId: string;
    IslandManagementMechanicId: string;
    BlueprintCurrencyShapes: Array<BlueprintCurrencyShape>;
    BlueprintDiscountUpgradeId: string;
    HubInputSizeUpgradeId: string;
    ShapesConfigurationId: string;
    ColorSchemeConfigurationId: string;
    SpeedsToLinearUpgradeMappings: typeof LINEAR_SPEED_UPGRADES;
    IntroductionWikiEntryId: string;
};
type BlueprintCurrencyShape = {
    Shape: ShapeIdentifier;
    RequiredUpgradeId: string;
    Amount: number;
};
const LINEAR_SPEED_UPGRADES = {
    "BeltSpeed": "LRUBeltSpeed",
    "CutterSpeed": "LRUCuttingSpeed",
    "StackerSpeed": "LRUStackingSpeed",
    "PainterSpeed": "LRUPaintingSpeed",
};

type ScenarioStartingLocation = {
    Hub: ScenarioLocation;
    InitialViewport: ScenarioViewportConfig;
    InitialIslands: Array<ScenarioLocation>;
    FixedPatches: Array<ScenarioShapePatch>;
    StartingChunks: Array<ScenarioChunk>;
};
type ScenarioLocation = {
    Position_GC: ScenarioPosition;
    Rotation: 0 | 1 | 2 | 3;
    LayoutId: LayoutId;
};
type ScenarioPosition = {
    x?: number | undefined,
    y?: number | undefined,
};
type ScenarioViewportConfig = {
    PositionX: number;
    PositionY: number;
    Zoom: number;
    Angle: number;
    ShowAllLayers: boolean;
};
type ScenarioShapePatch = {
    Shape: ShapeIdentifier;
    Position_LC: ScenarioPosition;
    LocalTiles: Array<ScenarioPosition>;
};
type ScenarioChunk = {
    SuperChunk: ScenarioPosition;
    GuaranteedShapePatches: Array<ShapeIdentifier>;
    GuaranteedColorPatches: Array<ShapeColor>;
};
