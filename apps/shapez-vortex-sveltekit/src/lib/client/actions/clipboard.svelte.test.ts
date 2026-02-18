import { it, expect, describe, vi } from 'vitest';
import { copy, paste } from './clipboard.svelte';

describe('copy', () => {
  it('success - navigator clipboard', () => {
    vi.stubGlobal('isSecureContext', true);
    const mockClipboardWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockClipboardWriteText,
      },
    });
    const data = { value: 'test' };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    expect(mockClipboardWriteText).toBeCalledTimes(1);
  });

  it('success - execCommand', () => {
    vi.stubGlobal('isSecureContext', false);
    const spyInputValue = vi.spyOn(HTMLInputElement.prototype, 'value', 'set');
    const mockDocumentExecCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, {
      execCommand: mockDocumentExecCommand,
    });
    const data = { value: 'test' };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    expect(spyInputValue).toBeCalledWith(data.value);
    expect(mockDocumentExecCommand).toBeCalledWith('copy');
  });

  it('success - oncopy', () => {
    vi.stubGlobal('isSecureContext', false);
    const mockDocumentExecCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, {
      execCommand: mockDocumentExecCommand,
    });
    const mockEventCallback = vi.fn();
    const data = { value: 'test', oncopy: mockEventCallback };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    expect(mockEventCallback).toBeCalledWith(data.value);
  });

  it('success - dispose', () => {
    vi.stubGlobal('isSecureContext', false);
    const spyButtonAddEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'addEventListener',
    );
    const spyButtonRemoveEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'removeEventListener',
    );
    const data = { value: 'test' };
    const button = document.createElement('button');

    const attachment = copy(data);
    const dispose = attachment(button);
    dispose?.call(this);

    expect(spyButtonAddEventListener).toBeCalledTimes(1);
    expect(spyButtonRemoveEventListener).toBeCalledTimes(1);
  });

  it('failure - onerror execCommand error', () => {
    vi.stubGlobal('isSecureContext', false);
    const mockDocumentExecCommand = vi.fn(() => {
      throw new Error();
    });
    Object.assign(document, {
      execCommand: mockDocumentExecCommand,
    });
    const mockEventCallback = vi.fn();
    const data = { value: 'test', onerror: mockEventCallback };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    expect(mockEventCallback).toBeCalledTimes(1);
  });

  it('failure - onerror execCommand failed', () => {
    vi.stubGlobal('isSecureContext', false);
    const mockDocumentExecCommand = vi.fn().mockReturnValue(false);
    Object.assign(document, {
      execCommand: mockDocumentExecCommand,
    });
    const mockEventCallback = vi.fn();
    const data = { value: 'test', onerror: mockEventCallback };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    expect(mockEventCallback).toBeCalledTimes(1);
  });

  it('failure - onerror navigator clipboard', async () => {
    vi.stubGlobal('isSecureContext', true);
    const mockClipboardWriteText = vi.fn().mockRejectedValue('error');
    Object.assign(navigator, {
      clipboard: {
        writeText: mockClipboardWriteText,
      },
    });
    const mockEventCallback = vi.fn();
    const data = { value: 'test', onerror: mockEventCallback };
    const button = document.createElement('button');

    const attachment = copy(data);
    attachment(button);
    button.click();

    await expect.poll(() => mockEventCallback).toBeCalledWith('error');
  });
});

describe('paste', () => {
  it('success', () => {
    vi.stubGlobal('isSecureContext', true);
    const mockClipboardReadText = vi.fn().mockResolvedValue('test');
    Object.assign(navigator, {
      clipboard: {
        readText: mockClipboardReadText,
      },
    });
    const button = document.createElement('button');

    const attachment = paste({});
    attachment(button);
    button.click();

    expect(mockClipboardReadText).toBeCalledTimes(1);
  });

  it('success - onpaste', async () => {
    vi.stubGlobal('isSecureContext', true);
    const mockClipboardReadText = vi.fn().mockResolvedValue('test');
    Object.assign(navigator, {
      clipboard: {
        readText: mockClipboardReadText,
      },
    });
    const mockEventCallback = vi.fn();
    const data = { onpaste: mockEventCallback };
    const button = document.createElement('button');

    const attachment = paste(data);
    attachment(button);
    button.click();

    await expect.poll(() => mockEventCallback).toBeCalledWith('test');
  });

  it('success - dispose', () => {
    vi.stubGlobal('isSecureContext', true);
    const spyButtonAddEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'addEventListener',
    );
    const spyButtonRemoveEventListener = vi.spyOn(
      HTMLButtonElement.prototype,
      'removeEventListener',
    );
    const button = document.createElement('button');

    const attachment = paste({});
    const dispose = attachment(button);
    dispose?.call(this);

    expect(spyButtonAddEventListener).toBeCalledTimes(1);
    expect(spyButtonRemoveEventListener).toBeCalledTimes(1);
  });

  it('failure - onerror', () => {
    vi.stubGlobal('isSecureContext', false);
    const mockEventCallback = vi.fn();
    const data = { onerror: mockEventCallback };
    const button = document.createElement('button');

    const attachment = paste(data);
    attachment(button);
    button.click();

    expect(mockEventCallback).toBeCalledTimes(1);
  });

  it('failure - onerror navigator clipboard', async () => {
    vi.stubGlobal('isSecureContext', true);
    const mockClipboardReadText = vi.fn().mockRejectedValue('error');
    Object.assign(navigator, {
      clipboard: {
        readText: mockClipboardReadText,
      },
    });
    const mockEventCallback = vi.fn();
    const data = { onerror: mockEventCallback };
    const button = document.createElement('button');

    const attachment = paste(data);
    attachment(button);
    button.click();

    await expect.poll(() => mockEventCallback).toBeCalledWith('error');
  });
});
