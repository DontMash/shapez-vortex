import screenfull from 'screenfull';
import type { Action, ActionReturn } from 'svelte/action';

type Parameters = { fullscreenElement: HTMLElement };
type Attributes = {
	'on:change': (e: CustomEvent<boolean>) => void;
	'on:error': (e: CustomEvent<Error>) => void;
};

export const fullscreen: Action<HTMLButtonElement, Parameters> = (button, params) => {
	if (!screenfull.isEnabled) return;

	const onSuccess = () =>
		button.dispatchEvent(new CustomEvent('change', { detail: screenfull.isFullscreen }));
	const onFailure = (message: string) =>
		button.dispatchEvent(new CustomEvent<Error>('error', { detail: new Error(message) }));

	let fullscreenElement = params?.fullscreenElement;
	button.addEventListener('click', () => toggle(), true);
	screenfull.on('change', () => onSuccess());
	screenfull.on('error', () => onFailure('Fullscreen error'));

	function toggle() {
		screenfull.isEnabled
			? screenfull.toggle(fullscreenElement)
			: onFailure('Fullscreen not available');
	}

	return {
		update(params) {
			fullscreenElement = params.fullscreenElement;
		},
		destroy() {
			button.removeEventListener('click', () => toggle());

			screenfull.off('change', () => true);
			screenfull.off('error', () => true);
		}
	} satisfies ActionReturn<Parameters, Attributes>;
};
