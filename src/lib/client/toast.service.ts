import { writable } from 'svelte/store';

const TOAST_DURATION = 3000;
const TOAST_DELAY = 500;
export const TOAST_TYPE = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;
export type ToastType = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];
export type Toast = {
  type: ToastType;
  message: string;
  duration: number;
};
type ToastOptions = Partial<Toast> & Pick<Toast, 'message'>;

const queue: Array<Toast> = new Array<Toast>();
export const toastStore = writable<Toast | undefined>(undefined);
let timeout: number | undefined;

export const add = (options: ToastOptions) => {
  const {
    message,
    type = TOAST_TYPE.INFO,
    duration = TOAST_DURATION,
  } = options;
  queue.unshift({ type, message, duration });

  if (timeout) {
    return;
  }
  update();
};
const update = () => {
  const toast = queue.pop();
  if (!toast) {
    clearTimeout(timeout);
    timeout = undefined;
    return;
  }
  toastStore.update(() => toast);
  timeout = setTimeout(() => {
    toastStore.update(() => undefined);
    setTimeout(() => update(), TOAST_DELAY);
  }, toast.duration);
};
