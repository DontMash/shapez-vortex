import { escapePath } from 'tinyglobby';

export const minimum = {
  lines: 80.01,
  statements: 80.01,
  functions: 80.01,
  branches: 80.01,
};

export const coveragePolicy = {
  globalGate: false,
  completedGroups: [],
};

export function coverageThresholds(policy = coveragePolicy) {
  return {
    perFile: false,
    ...(policy.globalGate ? minimum : {}),
    ...Object.fromEntries(
      policy.completedGroups.map(({ files }) => {
        const paths = files.map(escapePath);
        return [
          paths.length === 1 ? paths[0] : `{${paths.join(',')}}`,
          minimum,
        ];
      }),
    ),
  };
}
