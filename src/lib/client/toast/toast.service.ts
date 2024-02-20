import { writable, type Writable } from 'svelte/store';

export const TOAST_TYPE = {
	INFO: 'INFO',
	SUCCESS: 'SUCCESS',
	WARNING: 'WARNING',
	ERROR: 'ERROR',
} as const;
export type ToastType = typeof TOAST_TYPE[keyof typeof TOAST_TYPE];
export type Toast = {
	type: ToastType;
	message: string;
	duration: number;
};

const queue: Array<Toast> = new Array<Toast>();
export const toastStore: Writable<Array<Toast>> = writable<Array<Toast>>([]);
let timeout: number | undefined;

export const subscribe: Writable<Array<Toast>>['subscribe'] = toastStore.subscribe;
export const add = (message: string, duration = 1000, type: ToastType = 'INFO') => {
	const toast: Toast = { type, message, duration };
	queue.unshift(toast);
	toastStore.update(() => [...queue]);

	if (timeout) return;
	update(duration);
};
const update = (duration: number) => {
	timeout = setTimeout(() => pop(), duration);
};
const pop = () => {
	const toast = queue.pop();
	toastStore.update(() => [...queue]);
	if (!toast) {
		clearTimeout(timeout);
		timeout = undefined;
		return;
	}
	update(toast.duration);
};
