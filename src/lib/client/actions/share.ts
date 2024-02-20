import type { Action, ActionReturn } from 'svelte/action';
import { add } from '../toast/toast.service';

const TOAST_DURATION = 3000;

type ShareParameters = {
    href: string;
};
type ShareAttributes = {
    'on:share': (e: CustomEvent<string>) => void;
};
export const share: Action<HTMLButtonElement, ShareParameters | undefined> = (button, params) => {
    button.addEventListener('click', () => onShare());

    function onShare() {
        const link = params ? params.href : window.location.href;
        navigator.clipboard
            .writeText(link)
            .then(() => {
                add('Link copied', TOAST_DURATION);
                button.dispatchEvent(new CustomEvent('share', { detail: link }));
            })
            .catch(() => {
                add('Cannot copy link!', TOAST_DURATION, 'ERROR');
            });
    }

    return {
        destroy() {
            button.removeEventListener('click', () => onShare());
        },
    } satisfies ActionReturn<ShareParameters, ShareAttributes>;
};
