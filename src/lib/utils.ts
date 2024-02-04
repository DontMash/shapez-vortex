export const capitalize = <T extends string>(value: T) => (value[0].toUpperCase() + value.slice(1)) as Capitalize<typeof value>;
