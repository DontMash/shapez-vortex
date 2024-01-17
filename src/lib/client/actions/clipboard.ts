import type { Action, ActionReturn } from 'svelte/action';
import { ToastType, add } from '../toast/toast.service';

type CopyParameters = { value: any; };
type CopyAttributes = {
    'on:copy': (e: CustomEvent<void>) => void;
};
export const copy: Action<HTMLButtonElement, CopyParameters> = (button, params) => {
    if (!params) {
        throw new Error('No copy parameters provided');
    }
    const TOAST_DURATION = 3000;
    const { value } = params;

    let copyValue = value;
    button.addEventListener('click', () => onCopy());

    function onCopy() {
        navigator.clipboard
            .writeText(typeof copyValue !== 'object' ? copyValue : JSON.stringify(copyValue, null, 4))
            .then(() => add('Content copied', TOAST_DURATION))
            .catch(() =>
                add('Cannot copy content!', TOAST_DURATION, ToastType.Error)
            ).finally(() => button.dispatchEvent(new CustomEvent('copy')));
    }

    return {
        update(params) {
            const { value } = params;
            copyValue = value;
        },
        destroy() {
            button.removeEventListener('click', () => onCopy());
        },
    } satisfies ActionReturn<CopyParameters, CopyAttributes>;
};

type PasteAttributes = {
    'on:paste': (e: CustomEvent<string>) => void;
};
export const paste: Action<HTMLButtonElement, any> = (button) => {
    button.addEventListener('click', () => onPaste());

    function onPaste() {
        navigator.clipboard
            .readText()
            .then((value) => button.dispatchEvent(new CustomEvent('paste', { detail: value })))
            .catch(() =>
                add('Cannot paste content!', 3000, ToastType.Error)
            );
    }

    return {
        destroy() {
            button.removeEventListener('click', () => onPaste());
        },
    } satisfies ActionReturn<undefined, PasteAttributes>;
};
