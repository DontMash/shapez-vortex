export type CoveragePolicy = {
  globalGate: boolean;
  completedGroups: { name: string; files: string[] }[];
};

export const minimum: {
  lines: number;
  statements: number;
  functions: number;
  branches: number;
};

export const coveragePolicy: CoveragePolicy;
export function coverageThresholds(
  policy?: CoveragePolicy,
): NonNullable<import('vitest/node').CoverageOptions['thresholds']>;
