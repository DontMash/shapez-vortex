export const capitalize = <T extends string>(value: T) =>
  (value[0].toUpperCase() + value.slice(1)) as Capitalize<typeof value>;

export const debounce = (fn: () => void, waitInMillis: number) => {
  let timeout: number | undefined;
  let exec: (() => void) | undefined;

  const debounced = () => {
    clear();
    exec = () => {
      clear();
      fn.call(debounce);
    };
    timeout = setTimeout(exec, waitInMillis);
  };

  const clear = () => {
    if (timeout === undefined) return;

    clearTimeout(timeout);
    timeout = undefined;
    exec = undefined;
  };

  return debounced;
};
