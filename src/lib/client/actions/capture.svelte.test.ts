import { it, expect, describe, beforeEach, vi } from 'vitest';
import { capture } from './capture.svelte';

describe('capture', () => {
  const mockCanvasToDataURL = vi.fn(() => '');
  const spyAnchorDownload = vi.spyOn(
    HTMLAnchorElement.prototype,
    'download',
    'set',
  );

  beforeEach(() => {
    HTMLCanvasElement.prototype.toDataURL = mockCanvasToDataURL;
  });

  it('success', () => {
    const data = { canvas: document.createElement('canvas') };
    const attachment = capture(data);
    const button = document.createElement('button');

    attachment(button);
    button.click();

    expect(mockCanvasToDataURL).toBeCalledTimes(1);
    expect(spyAnchorDownload).toBeCalledWith('screenshot');
  });

  it('success - filename', () => {
    const data = { canvas: document.createElement('canvas'), filename: 'test' };
    const attachment = capture(data);
    const button = document.createElement('button');

    attachment(button);
    button.click();

    expect(mockCanvasToDataURL).toBeCalledTimes(1);
    expect(spyAnchorDownload).toBeCalledWith('screenshot-test');
  });

  it('success - dispose', () => {
    const data = { canvas: document.createElement('canvas') };
    const attachment = capture(data);
    const button = document.createElement('button');
    const spyButtonAddEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'addEventListener',
    );
    const spyButtonRemoveEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'removeEventListener',
    );

    const dispose = attachment(button);
    dispose?.call(this);

    expect(spyButtonAddEventListener).toBeCalledTimes(1);
    expect(spyButtonRemoveEventListener).toBeCalledTimes(1);
  });
});
