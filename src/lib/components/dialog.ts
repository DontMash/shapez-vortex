import { cva } from 'class-variance-authority';

export const overlay = cva([
  'fixed',
  'inset-0',
  'z-50',
  'bg-background/70',
  'backdrop-blur-lg',
]);
export const content = cva(
  ['fixed', 'z-50', 'w-full', 'max-w-screen-sm', 'p-4', 'outline-none'],
  {
    variants: {
      position: {
        top: ['top-0', 'left-1/2', '-translate-x-1/2'],
        center: ['top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2'],
      },
    },
    defaultVariants: {
      position: 'top',
    },
  },
);
