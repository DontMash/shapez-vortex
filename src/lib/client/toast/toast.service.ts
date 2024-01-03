import { writable, type Writable } from 'svelte/store';

export enum ToastType {
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error'
}
export type Toast = {
	type: ToastType;
	message: string;
	duration: number;
};

const queue: Array<Toast> = new Array<Toast>();
const toastStore: Writable<Toast> = writable<Toast>();
let timeout: NodeJS.Timeout | undefined;

export const subscribe: Writable<Toast>['subscribe'] = toastStore.subscribe;
export const add = (message: string, duration = 1000, type: ToastType = ToastType.Info) => {
	const toast: Toast = { type, message, duration };
	queue.unshift(toast);

	if (!timeout) pop();
};
const pop = () => {
	const toast = queue.pop();
	if (!toast) {
		clearTimeout(timeout);
		timeout = undefined;
		return;
	}

	toastStore.update(() => toast);
	timeout = setTimeout(() => pop(), toast.duration);
};
