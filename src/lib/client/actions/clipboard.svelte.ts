import type { Attachment } from 'svelte/attachments';

type CopyParameters = {
  value: string;
  oncopy?: (value: string) => void;
  onerror?: (error: Error) => void;
};
export const copy = (params: CopyParameters): Attachment<HTMLButtonElement> => {
  const hasClipboard = !!navigator.clipboard;
  const hasCopyClipboard = hasClipboard && !!navigator.clipboard.writeText;

  return (element) => {
    element.addEventListener('click', copy, { passive: true });

    function copy() {
      const { value, oncopy, onerror } = params;
      const onsuccess = (value: string) => oncopy && oncopy(value);
      const onfailure = (error: Error) => onerror && onerror(error);

      if (window.isSecureContext && hasCopyClipboard) {
        navigator.clipboard
          .writeText(value)
          .then(() => onsuccess(value))
          .catch((err) => onerror && onerror(err));
      } else {
        try {
          const input = document.createElement('input');
          document.body.appendChild(input);
          input.value = value;
          input.select();
          const success = document.execCommand('copy');
          document.body.removeChild(input);
          if (success) {
            onsuccess(value);
          } else {
            const error = new Error('Copy not successful');
            onfailure(error);
          }
        } catch (err) {
          const error = new Error(`Copy failed: ${err}`);
          onfailure(error);
        }
      }
    }

    return () => element.removeEventListener('click', copy);
  };
};

type PasteParameters = {
  onpaste?: (value: string) => void;
  onerror?: (error: Error) => void;
};
export const paste = (
  params: PasteParameters,
): Attachment<HTMLButtonElement> => {
  const hasClipboard = !!navigator.clipboard;
  const hasPasteClipboard = hasClipboard && !!navigator.clipboard.readText;

  return (element) => {
    element.addEventListener('click', paste, { passive: true });

    function paste() {
      const { onpaste, onerror } = params;
      const onsuccess = (value: string) => onpaste && onpaste(value);
      const onfailure = (error: Error) => onerror && onerror(error);

      if (window.isSecureContext && hasPasteClipboard) {
        navigator.clipboard
          .readText()
          .then((value) => onsuccess(value))
          .catch((error) => onfailure(error));
      } else {
        const error = new Error(`Paste failed: browser not supported`);
        onfailure(error);
      }
    }

    return () => element.removeEventListener('click', paste);
  };
};
