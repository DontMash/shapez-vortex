import type RESEARCH_DATA from '$lib/assets/data/research-metadata.json';
import type { ShapeIdentifier } from './shape.types';

export type ResearchEntry = {
    Node: ResearchGoal;
    SideGoals: Array<ResearchGoal>;
};
export type ResearchGoal = {
    Id: ResearchLevel['Node']['Id'] | ResearchLevel['SideGoals'][number]['Id'];
    Title: string,
    Description: string,
    GoalShape?: ShapeIdentifier,
    GoalAmount?: number,
    Unlocks: ResearchLevel['Node']['Unlocks'] | ResearchLevel['SideGoals'][number]['Unlocks'];
};
type ResearchLevel = typeof RESEARCH_DATA['Levels'][number];
