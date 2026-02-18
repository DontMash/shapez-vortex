import { it, expect, describe, vi, beforeEach } from 'vitest';

import { fullscreen } from './fullscreen.svelte';
import type { EventName } from 'screenfull';
import screenfull from 'screenfull';

let changeHandlers: ((event: Event) => void)[] = [];
let errorHandlers: ((event: Event) => void)[] = [];
let isFullscreenValue = false;
let isEnabledValue = true;

vi.mock('screenfull', () => ({
  default: {
    get isFullscreen() {
      return isFullscreenValue;
    },
    get isEnabled() {
      return isEnabledValue;
    },
    element: undefined,
    raw: {
      requestFullscreen: '',
      exitFullscreen: '',
      fullscreenElement: '',
      fullscreenEnabled: '',
      fullscreenchange: '',
      fullscreenerror: '',
    },
    request: vi.fn().mockResolvedValue(undefined),
    exit: vi.fn().mockResolvedValue(undefined),
    toggle: vi.fn().mockResolvedValue(undefined),
    on: vi.fn((name: EventName, handler: (event: Event) => void) => {
      if (name === 'change') {
        changeHandlers.push(handler);
      } else if (name === 'error') {
        errorHandlers.push(handler);
      }
    }),
    off: vi.fn((name: EventName, handler: (event: Event) => void) => {
      if (name === 'change') {
        changeHandlers = changeHandlers.filter((h) => h !== handler);
      } else if (name === 'error') {
        errorHandlers = errorHandlers.filter((h) => h !== handler);
      }
    }),
    onchange: vi.fn(),
    onerror: vi.fn(),
  },
}));

describe('fullscreen', () => {
  beforeEach(() => {
    changeHandlers = [];
    errorHandlers = [];
    isFullscreenValue = false;
    isEnabledValue = true;
    vi.clearAllMocks();
  });

  it('should return an attachment function that attaches click listener', () => {
    const data = {
      fullscreenElement: document.createElement('div'),
      onchange: vi.fn(),
    };
    const button = document.createElement('button');

    const attachment = fullscreen(data);

    // Validate that attachment is a function
    expect(attachment).toBeTypeOf('function');

    // Call the attachment function with the button element
    const cleanup = attachment(button);

    // Validate that cleanup is a function
    expect(cleanup).toBeTypeOf('function');
  });

  it('should toggle fullscreen when button is clicked', async () => {
    const fullscreenElement = document.createElement('div');
    const mockOnChange = vi.fn();
    const data = {
      fullscreenElement,
      onchange: mockOnChange,
    };
    const button = document.createElement('button');

    const attachment = fullscreen(data);
    attachment(button);

    // Click the button to trigger toggle
    button.click();

    // Wait for async toggle to complete
    await vi.waitFor(() => {
      expect(screenfull.toggle).toHaveBeenCalledWith(fullscreenElement);
    });
  });
});

it('should call onchange callback when fullscreen state changes', async () => {
  const mockOnChange = vi.fn();
  const data = {
    fullscreenElement: document.createElement('div'),
    onchange: mockOnChange,
  };
  const button = document.createElement('button');

  const attachment = fullscreen(data);
  attachment(button);

  // Verify screenfull change handler was registered
  expect(screenfull.on).toHaveBeenCalledWith('change', expect.any(Function));

  // Simulate fullscreen change event
  isFullscreenValue = true;
  changeHandlers.forEach((handler) => handler(new Event('change')));

  expect(mockOnChange).toHaveBeenCalledWith(true);
});

it('should call onerror callback when fullscreen fails', async () => {
  const mockOnError = vi.fn();
  const data = {
    fullscreenElement: document.createElement('div'),
    onerror: mockOnError,
  };
  const button = document.createElement('button');

  const attachment = fullscreen(data);
  attachment(button);

  // Verify screenfull error handler was registered
  expect(screenfull.on).toHaveBeenCalledWith('error', expect.any(Function));

  // Simulate fullscreen error event
  errorHandlers.forEach((handler) => handler(new Event('error')));

  expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
});

it('should cleanup listeners when attachment cleanup is called', () => {
  const data = {
    fullscreenElement: document.createElement('div'),
    onchange: vi.fn(),
  };
  const button = document.createElement('button');
  const clickSpy = vi.spyOn(button, 'removeEventListener');

  const attachment = fullscreen(data);
  const cleanup = attachment(button);

  // Verify cleanup is a function
  expect(cleanup).toBeTypeOf('function');

  // Call cleanup function
  if (cleanup) {
    cleanup();
  }

  // Verify click listener was removed
  expect(clickSpy).toHaveBeenCalledWith('click', expect.any(Function));

  // Verify screenfull handlers were removed
  expect(screenfull.off).toHaveBeenCalledWith('change', expect.any(Function));
  expect(screenfull.off).toHaveBeenCalledWith('error', expect.any(Function));
});

it('should not attach listeners when screenfull is disabled', () => {
  isEnabledValue = false;

  const data = {
    fullscreenElement: document.createElement('div'),
    onchange: vi.fn(),
  };
  const button = document.createElement('button');

  const attachment = fullscreen(data);
  const cleanup = attachment(button);

  // Verify no handlers were registered
  expect(screenfull.on).not.toHaveBeenCalled();

  // Cleanup should be undefined when screenfull is disabled
  expect(cleanup).toBeUndefined();
});
