import type { Action, ActionReturn } from 'svelte/action';

type CopyParameters = { value: string };
type CopyAttributes = {
	'on:copy': (e: CustomEvent<string>) => void;
	'on:error': (e: CustomEvent<Error>) => void;
};
export const copy: Action<HTMLButtonElement, CopyParameters> = (button, params) => {
	if (!params) {
		throw new Error('No copy parameters provided');
	}
	const hasClipboard = !!navigator.clipboard;
	const hasCopyClipboard = hasClipboard && !!navigator.clipboard.writeText;
	const { value } = params;

	let copyValue = value;
	button.addEventListener('click', () => onCopy());

	function onCopy() {
		const onSuccess = () =>
			button.dispatchEvent(new CustomEvent<string>('copy', { detail: copyValue }));
		const onFailure = (message: string) =>
			button.dispatchEvent(new CustomEvent<Error>('error', { detail: new Error(message) }));
		if (window.isSecureContext && hasCopyClipboard) {
			navigator.clipboard.writeText(copyValue).then(onSuccess).catch(onFailure);
		} else {
			try {
				const input = document.createElement('input');
				document.body.appendChild(input);
				input.value = copyValue;
				input.select();
				const success = document.execCommand('copy');
				document.body.removeChild(input);
				success ? onSuccess() : onFailure('Copy not successful');
			} catch (error) {
				onFailure(`Copy failed: ${error}`);
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
		}
	} satisfies ActionReturn<CopyParameters, CopyAttributes>;
};

type PasteAttributes = {
	'on:paste': (e: CustomEvent<string>) => void;
	'on:error': (e: CustomEvent<Error>) => void;
};
export const paste: Action<HTMLButtonElement> = (button) => {
	const hasClipboard = !!navigator.clipboard;
	const hasPasteClipboard = hasClipboard && !!navigator.clipboard.readText;

	button.addEventListener('click', () => onPaste());

	function onPaste() {
		const onSuccess = (value: string) =>
			button.dispatchEvent(new CustomEvent<string>('paste', { detail: value }));
		const onFailure = (message: string) =>
			button.dispatchEvent(new CustomEvent<Error>('error', { detail: new Error(message) }));
		if (window.isSecureContext && hasPasteClipboard) {
			navigator.clipboard.readText().then(onSuccess).catch(onFailure);
		} else {
			onFailure(`Paste failed: browser not supported`);
		}
	}

	return {
		destroy() {
			button.removeEventListener('click', () => onPaste());
		}
	} satisfies ActionReturn<undefined, PasteAttributes>;
};
