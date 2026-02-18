import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { capitalize, debounce } from './utils';

describe('captialize', () => {
  it('success', () => {
    const data = 'test';
    const result = capitalize(data);
    expect(result).toBe('Test');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('success', () => {
    const data = vi.fn();
    const wait = 100;
    const result = debounce(data, wait);
    expect(data).not.toBeCalled();
    result();
    expect(data).not.toBeCalled();
    vi.advanceTimersByTime(wait);
    expect(data).toBeCalled();
  });

  it('success - called again', () => {
    const data = vi.fn(() => console.log('test'));
    const wait = 100;
    const result = debounce(data, wait);
    expect(data).not.toBeCalled();
    result();
    expect(data).not.toBeCalled();
    result();
    expect(data).not.toBeCalled();
    vi.advanceTimersByTime(100);
    expect(data).toBeCalledTimes(1);
  });
});
