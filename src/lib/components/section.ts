import { cva } from 'class-variance-authority';

export const section = cva(['mx-auto', 'w-full', 'max-w-5xl'], {
  variants: {
    x: {
      false: null,
      true: ['px-4', 'sm:px-12'],
    },
    y: {
      false: null,
      true: ['py-12', 'sm:py-24'],
    },
  },
  defaultVariants: { x: true, y: true },
});
