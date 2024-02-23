import type { Action, ActionReturn } from 'svelte/action';
import { add } from '../toast/toast.service';
import { goto } from '$app/navigation';

type CopyParameters = { value: any; };
type CopyAttributes = {
    'on:copy': (e: CustomEvent<void>) => void;
};
export const copy: Action<HTMLButtonElement, CopyParameters> = (button, params) => {
    if (!params) {
        throw new Error('No copy parameters provided');
    }
    const TOAST_DURATION = 3000;
    const hasClipboard = !!navigator.clipboard;
    const hasCopyClipboard = hasClipboard && !!navigator.clipboard.writeText;
    const { value } = params;

    let copyValue = value;
    button.addEventListener('click', () => onCopy());

    function onCopy() {
        const content = typeof copyValue !== 'object' ? copyValue : JSON.stringify(copyValue, null, 4);
        const onSuccess = () => add('Content copied');
        const onFailure = () => add('Cannot copy content!', TOAST_DURATION, 'ERROR');
        const onFinal = () => button.dispatchEvent(new CustomEvent('copy'));
        if (hasCopyClipboard) {
            navigator.clipboard
                .writeText(content)
                .then(onSuccess)
                .catch(onFailure)
                .finally(onFinal);
        } else {
            try {
                const success = document.execCommand('copy', false, content);
                success ? onSuccess() : onFailure();
            } catch (error) {
                onFailure();
            } finally {
                onFinal();
            }
        }
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
    const hasClipboard = !!navigator.clipboard;
    const hasPasteClipboard = hasClipboard && !!navigator.clipboard.readText;

    button.addEventListener('click', () => onPaste());

    function onPaste() {
        const onSuccess = (value: string) => button.dispatchEvent(new CustomEvent<string>('paste', { detail: value }));
        const onFailure = () => add('Cannot paste content!', 3000, 'ERROR');
        if (hasPasteClipboard) {
            navigator.clipboard
                .readText()
                .then(onSuccess)
                .catch(onFailure);
        } else {
            goto('/blueprint');
        }
    }

    return {
        destroy() {
            button.removeEventListener('click', () => onPaste());
        },
    } satisfies ActionReturn<undefined, PasteAttributes>;
};
