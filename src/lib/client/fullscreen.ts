import screenfull from 'screenfull';
import type { Action, ActionReturn } from 'svelte/action';

import { ToastType, add } from '$lib/client/toast/toast.service';

type Parameters = { fullscreenElement: HTMLElement; };
type Attributes = {
    'on:change': (e: CustomEvent<boolean>) => void;
};

export const fullscreen: Action<HTMLButtonElement, Parameters> = (element, params) => {
    if (!screenfull.isEnabled) return;

    let fullscreenElement = params?.fullscreenElement;
    element.addEventListener('click', () => toggle(), true);
    screenfull.on('change', () => {
        element.dispatchEvent(new CustomEvent('change', { detail: screenfull.isFullscreen }));
    });
    screenfull.on('error', () => {
        add('Fullscreen error', 3000, ToastType.Error);
    });

    function toggle() {
        screenfull.isEnabled
            ? screenfull.toggle(fullscreenElement)
            : add('Fullscreen not available', 3000, ToastType.Error);
    }

    return {
        update(params) {
            fullscreenElement = params.fullscreenElement;
        },
        destroy() {
            element.removeEventListener('click', () => toggle());

            screenfull.off('change', () => true);
            screenfull.off('error', () => true);
        },
    } satisfies ActionReturn<Parameters, Attributes>;
};
