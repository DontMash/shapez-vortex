import type { Action, ActionReturn } from 'svelte/action';

type CaptureParameters = {
  captureElement: HTMLCanvasElement;
  filename?: string | undefined;
};
type CaptureAttributes = {
  'on:capture': (e: CustomEvent<void>) => void;
};
export const capture: Action<HTMLButtonElement, CaptureParameters> = (
  button,
  params: CaptureParameters,
) => {
  if (!params) {
    throw new Error('No capture parameters provided');
  }
  const { captureElement, filename } = params;

  let canvas = captureElement;
  let name = filename;
  button.addEventListener('click', () => onCapture());

  function onCapture() {
    const imageData = canvas.toDataURL('image/png');
    const aElement = document.createElement('a');
    aElement.href = imageData;
    aElement.download = name ? `screenshot-${name}` : 'screenshot';
    aElement.click();
  }

  return {
    update(params) {
      const { captureElement, filename } = params;
      canvas = captureElement;
      name = filename;
    },
    destroy() {
      button.removeEventListener('click', () => onCapture());
    },
  } satisfies ActionReturn<CaptureParameters, CaptureAttributes>;
};
