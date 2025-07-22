// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toBlob } from './utils';

describe('toBlob', () => {
  const mockToBlob = vi.fn((callback: BlobCallback) => callback(new Blob()));
  beforeEach(() => {
    HTMLCanvasElement.prototype.toBlob = mockToBlob;
  });

  it('success', async () => {
    const data = document.createElement('canvas');
    const result = toBlob(data);
    await expect(result).resolves.toBeInstanceOf(Blob);
    expect(mockToBlob).toHaveBeenCalledOnce();
  });

  it('failure', async () => {
    mockToBlob.mockImplementationOnce((callback: BlobCallback) =>
      callback(null),
    );
    const data = document.createElement('canvas');
    const result = toBlob(data);
    await expect(result).rejects.toThrowError();
    expect(mockToBlob).toHaveBeenCalledOnce();
  });
});

// TODO: readd tests for filelist; depends on DataTransfer-Mock in jsdom
// describe('toFileList', () => {
//   it('success', () => {
//     const data = [new File([new Blob()], 'test')];
//     const result = toFileList(data);
//     expect(result).toBeInstanceOf(FileList);
//     expect(result.length).toBe(1);
//     expect(result.item(0)).toEqual(data);
//   });
// });
