import type { Action, ActionReturn } from 'svelte/action';
import { ToastType, add } from '$lib/client/toast/toast.service';

type CaptureParameters = {
    captureElement: HTMLCanvasElement;
};
type CaptureAttributes = {
    'on:capture': (e: CustomEvent<void>) => void;
};
export const capture: Action<HTMLButtonElement, CaptureParameters> = (button, params) => {
    if (!params) {
        throw new Error('No capture parameters provided');
    }
    const { captureElement } = params;

    let canvas = captureElement;
    button.addEventListener('click', () => onCapture());

    function onCapture() {
        const imageData = canvas.toDataURL('image/png');
        const aElement = document.createElement('a');
        aElement.href = imageData;
        aElement.download = 'capture';
        aElement.click();
    }

    return {
        update(params) {
            const { captureElement } = params;
            canvas = captureElement;
        },
        destroy() {
            button.removeEventListener('click', () => onCapture());
        },
    } satisfies ActionReturn<CaptureParameters, CaptureAttributes>;
};
