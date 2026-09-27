import screenfull from 'screenfull';
import type { Attachment } from 'svelte/attachments';

type FullscreenParameters = {
  fullscreenElement: HTMLElement;
  onchange?: (isFullscreen: boolean) => void;
  onerror?: (error: Error) => void;
};

export const fullscreen = (
  params: FullscreenParameters,
): Attachment<HTMLButtonElement> => {
  return (element) => {
    if (!screenfull.isEnabled) return;

    const { fullscreenElement, onchange, onerror } = params;
    const onsuccess = () => {
      if (onchange) {
        onchange(screenfull.isFullscreen);
      }
    };
    const onfailure = () => {
      if (onerror) {
        const error = new Error('Failed to use fullscreen');
        onerror(error);
      }
    };

    screenfull.on('change', () => onsuccess);
    screenfull.on('error', () => onfailure);

    element.addEventListener('click', toggle, { passive: true });

    async function toggle() {
      if (screenfull.isEnabled) {
        await screenfull.toggle(fullscreenElement);
      } else {
        onfailure();
      }
    }

    return () => {
      element.removeEventListener('click', toggle);

      screenfull.off('change', onsuccess);
      screenfull.off('error', onfailure);
    };
  };
};
