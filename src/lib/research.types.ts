export type ResearchType = 'milestone' | 'side-goal' | 'upgrade';
export type ResearchCategoryIdentifier =
    | 'RCTransport'
    | 'RCCutStack'
    | 'RCIslands'
    | 'RCFluids'
    | 'RCTrains'
    | 'RCWires'
    | 'RCUtility';
export type ResearchEntry = {
    Id: string;
    Title: string;
    Description: string;
    GoalShape: string | null;
    GoalAmount: number;
    DependentLevelId: string;
    LevelIndex: number;
    DependentLevelIndex: number;
    Dependencies: Array<string> | null;
};

export const nodeColorVariants: Record<ResearchCategoryIdentifier, string> = {
    RCTransport: 'bg-red-500',
    RCCutStack: 'bg-orange-500',
    RCIslands: 'bg-amber-500',
    RCFluids: 'bg-lime-500',
    RCTrains: 'bg-teal-500',
    RCWires: 'bg-blue-500',
    RCUtility: 'bg-purple-500'
};
export const upgradeColorVariants: Record<ResearchCategoryIdentifier, string> = {
    RCTransport: 'bg-red-300',
    RCCutStack: 'bg-orange-300',
    RCIslands: 'bg-amber-300',
    RCFluids: 'bg-lime-300',
    RCTrains: 'bg-teal-300',
    RCWires: 'bg-blue-300',
    RCUtility: 'bg-purple-300'
};
