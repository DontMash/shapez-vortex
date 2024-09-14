import type { Action, ActionReturn } from 'svelte/action';

type ClearParameters = {
    inputElement: HTMLInputElement;
};
type ClearAttributes = {
    'on:clear': (e: CustomEvent<void>) => void;
};
export const clear: Action<HTMLButtonElement, ClearParameters> = (button, params: ClearParameters) => {
    if (!params) {
        throw new Error('No clear parameters provided');
    }
    const { inputElement } = params;

    let input = inputElement;
    button.addEventListener('click', () => onClear());

    function onClear() {
        input.value = '';
        input.focus();
    }

    return {
        update(params) {
            const { inputElement } = params;
            input = inputElement;
        },
        destroy() {
            button.removeEventListener('click', () => onClear());
        },
    } satisfies ActionReturn<ClearParameters, ClearAttributes>;
};
