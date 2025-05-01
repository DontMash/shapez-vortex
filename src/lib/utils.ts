export const capitalize = <T extends string>(value: T) =>
  (value[0].toUpperCase() + value.slice(1)) as Capitalize<typeof value>;

export const debounce = (fn: () => void, wait: number) => {
  let timeout: number | undefined;
  let exec: (() => void) | undefined;

  const debounced = () => {
    clear();
    exec = () => {
      clear();
      fn.call(debounce);
    };
    timeout = setTimeout(exec, wait);
  };

  const clear = () => {
    if (typeof timeout !== 'number') return;

    clearTimeout(timeout);
    timeout = undefined;
    exec = undefined;
  };

  return debounced;
};

export const toBlob = (canvas: HTMLCanvasElement, type: string = 'image/webp') =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject('Invalid blob');
      }
      resolve(blob);
    }, type);
  });
