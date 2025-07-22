export const toBlob = (
  canvas: HTMLCanvasElement,
  type: string = 'image/webp',
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('Invalid blob'));
      }
      resolve(blob);
    }, type);
  });

export const toFileList = (files: Array<File>) => {
  const data = new DataTransfer();
  files.forEach((file) => data.items.add(file));
  return data.files;
};
