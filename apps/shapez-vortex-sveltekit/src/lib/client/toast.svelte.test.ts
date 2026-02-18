import { describe, it, expect, afterEach } from 'vitest';
import ToastService from './toast.svelte';

describe('dispose', () => {
  it('success', () => {
    const data = { message: 'test' };
    const toastService = ToastService.instance;
    toastService.add(data);
    expect(toastService.queue.length).toBe(1);
    ToastService.dispose();
    expect(toastService.queue.length).toBe(0);
  });
});

describe('queue', () => {
  afterEach(() => {
    ToastService.dispose();
  });

  it('success', () => {
    const toastService = ToastService.instance;
    const result = toastService.queue;

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(0);
  });

  it('success - toast added', () => {
    const data = { message: 'test' };
    const toastService = ToastService.instance;
    const result = toastService.queue;
    toastService.add(data);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(1);
  });
});

describe('add', () => {
  afterEach(() => {
    ToastService.dispose();
  });

  it('success', () => {
    const data = { message: 'test' };

    const toastService = ToastService.instance;
    toastService.add(data);
    const result = toastService.queue;

    expect(result.length).toBe(1);
  });

  it('success - twice', () => {
    const data = { message: 'test' };

    const toastService = ToastService.instance;
    toastService.add({ duration: 1000, ...data });
    toastService.add(data);
    const result = toastService.queue;

    expect(result.length).toBe(2);
    expect(result.at(-1)).toEqual({
      duration: 1000,
      type: 'INFO', // default type
      ...data,
    });
  });
});

describe('use', () => {
  afterEach(() => {
    ToastService.dispose();
  });

  it('success', () => {
    const data = { message: 'test' };

    const toastService = ToastService.instance;
    toastService.add(data);
    const result = toastService.use();

    expect(result).toEqual({ duration: 3000, type: 'INFO', ...data });
  });

  it('success - empty', () => {
    const toastService = ToastService.instance;
    const result = toastService.use();

    expect(result).toBe(undefined);
  });
});
