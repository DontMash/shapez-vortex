const TOAST_DURATION = 3000;
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

export default class ToastService {
  private static _instance: ToastService | undefined;
  private _state = $state<Array<Toast>>([]);
  private state = $derived(this._state);

  private constructor() {}

  static get instance(): ToastService {
    if (!ToastService._instance) {
      this._instance = new ToastService();
    }
    return ToastService._instance!;
  }

  static dispose() {
    this.instance.state = [];
    this._instance = undefined;
  }

  get queue() {
    return this.state;
  }

  add(options: ToastOptions) {
    const {
      message,
      type = TOAST_TYPE.INFO,
      duration = TOAST_DURATION,
    } = options;

    this._state.unshift({ type, message, duration });
  }

  use() {
    return this._state.pop();
  }
}
