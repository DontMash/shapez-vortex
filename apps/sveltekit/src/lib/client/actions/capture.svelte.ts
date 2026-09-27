import type { Attachment } from 'svelte/attachments';

type CaptureParameters = {
  canvas: HTMLCanvasElement;
  filename?: string | undefined;
};

export const capture = (
  params: CaptureParameters,
): Attachment<HTMLButtonElement> => {
  return (element) => {
    const { canvas, filename } = params;
    const onclick = () => {
      onCapture(canvas, filename);
    };
    element.addEventListener('click', onclick, { passive: true });

    return () => {
      element.removeEventListener('click', onclick);
    };
  };
};

function onCapture(canvas: HTMLCanvasElement, filename?: string) {
  const imageData = canvas.toDataURL('image/png');
  const aElement = document.createElement('a');
  aElement.href = imageData;
  aElement.download = filename ? `screenshot-${filename}` : 'screenshot';
  aElement.click();
}
