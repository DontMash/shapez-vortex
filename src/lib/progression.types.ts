import type { BuildingVariantId, LayoutId, TranslationString, MechanicId, WikiEntryId } from '$lib/game.types';
import { WIKI_ENTRIES, BUILDINGS_VARIANTS, MECHANICS, ISLAND_LAYOUTS } from '$lib/game.types';
import type { ObjectValues } from '$lib/utils';
import type { ShapeIdentifier } from '$lib/shape.types';
import { z } from 'zod';

export type Progression = {
    Levels: Array<ProgressionMilestone>;
    SideQuestGroups: Array<ProgressionSideGoalGroup>;
    SideUpgrades: Array<ProgressionSideUpgrade>;
    LinearUpgrades: Array<ProgressionLinearUpgrade>;
};

export type ProgressionMilestone = {
    Id: ProgressionMilestoneId;
    Title: TranslationString;
    Description: TranslationString;
    Rewards: Array<ProgressionReward>;
    Lines: Array<ProgressionGoal>;
};
type ProgressionMilestoneId = string;

export type ProgressionReward = ProgressionBuildingReward | ProgressionIslandLayoutReward | ProgressionWikiEntryReward | ProgressionUnlockReward | ProgressionValueReward;
type ProgressionBuildingReward = {
    $type: typeof PROGRESSION_REWARD_TYPES['BUILDING'];
    BuildingVariantId: BuildingVariantId;
};
type ProgressionIslandLayoutReward = {
    $type: typeof PROGRESSION_REWARD_TYPES['ISLAND_LAYOUT'];
    LayoutId: LayoutId;
};
type ProgressionWikiEntryReward = {
    $type: typeof PROGRESSION_REWARD_TYPES['WIKI_ENTRY'];
    EntryId: WikiEntryId;
};
type ProgressionUnlockReward = {
    $type: typeof PROGRESSION_REWARD_TYPES['MECHANIC'];
    MechanicId: MechanicId;
};
type ProgressionValueReward = {
    $type: typeof PROGRESSION_REWARD_TYPES['RESEARCH_POINTS'] | typeof PROGRESSION_REWARD_TYPES['CHUNK_LIMIT'] | typeof PROGRESSION_REWARD_TYPES['BLUEPRINT_CURRENCY'];
    Amount: number;
};
export const PROGRESSION_REWARD_TYPES = {
    BUILDING: 'BuildingReward',
    ISLAND_LAYOUT: 'IslandLayoutReward',
    WIKI_ENTRY: 'WikiEntryReward',
    MECHANIC: 'MechanicReward',
    // value types
    RESEARCH_POINTS: 'ResearchPointsReward',
    CHUNK_LIMIT: 'ChunkLimitReward',
    BLUEPRINT_CURRENCY: 'BlueprintCurrencyReward',
} as const;
export type ProgressionRewardType = ObjectValues<typeof PROGRESSION_REWARD_TYPES>;
const PROGRESSION_WIKI_ENTRY_REWARDS: Array<ProgressionWikiEntryReward> = WIKI_ENTRIES.map(wikiEntry => ({ $type: PROGRESSION_REWARD_TYPES.WIKI_ENTRY, EntryId: wikiEntry }));
const PROGRESSION_BUILDING_REWARDS: Array<ProgressionBuildingReward> = BUILDINGS_VARIANTS.map(buildingVariant => ({ $type: PROGRESSION_REWARD_TYPES.BUILDING, BuildingVariantId: buildingVariant }));
const PROGRESSION_MECHANIC_REWARDS: Array<ProgressionUnlockReward> = MECHANICS.map(mechanic => ({ $type: PROGRESSION_REWARD_TYPES.MECHANIC, MechanicId: mechanic }));
const PROGRESSION_ISLAND_LAYOUT_REWARDS: Array<ProgressionIslandLayoutReward> = ISLAND_LAYOUTS.map(layout => ({ $type: PROGRESSION_REWARD_TYPES.ISLAND_LAYOUT, LayoutId: layout }));
export const PROGRESSION_REWARDS: Array<ProgressionReward> = [...PROGRESSION_WIKI_ENTRY_REWARDS, ...PROGRESSION_BUILDING_REWARDS, ...PROGRESSION_MECHANIC_REWARDS, ...PROGRESSION_ISLAND_LAYOUT_REWARDS];

export type ProgressionGoal = {
    Shapes: Array<ProgressionGoalShape>;
};
export type ProgressionGoalShape = {
    Shape: ShapeIdentifier;
    Amount: number;
};

export type ProgressionSideGoalGroup = {
    Title: string;
    RequiredUpgradeIds: Array<ProgressionMilestoneId>;
    SideQuests: Array<ProgressionSideGoal>;
};
export type ProgressionSideGoal = {
    Id: string;
    Rewards: Array<ProgressionReward>;
    Costs: Array<ProgressionGoalShape>;
};

export type ProgressionSideUpgrade = {
    Id: string;
    PreviewImageId: string;
    VideoId: string;
    Title: TranslationString;
    Description: TranslationString;
    RequiredUpgradeIds: Array<ProgressionMilestoneId>;
    Rewards: Array<ProgressionReward>;
    Costs: Array<ProgressionUpgradeCost>;
};
type ProgressionUpgradeCost = {
    $type: string;
    Amount: number;
};
export type ProgressionLinearUpgrade = {
    Id: string;
    Title: TranslationString;
    Levels: Array<ProgressionLinearUpgradeStep>;
    RequiredUpgradeId?: ProgressionMilestoneId | undefined;
};
type ProgressionLinearUpgradeStep = {
    Value: number;
    Cost?: ProgressionUpgradeCost | undefined;
};

export const PROGRESSION_MILESTONE_CREATE_SCHEMA = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
}).transform<ProgressionMilestone>(value => ({
    Id: value.id,
    Title: value.title ?? '',
    Description: value.description ?? '',
    Rewards: [],
    Lines: []
}));
