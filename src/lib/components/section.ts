import { cva } from 'class-variance-authority';

export const section = cva(['mx-auto', 'w-full', 'max-w-5xl'], {
  variants: {
    x: {
      false: null,
      true: ['px-4', 'sm:px-12'],
    },
    y: {
      false: null,
      true: ['py-8', 'sm:py-16'],
    },
  },
  defaultVariants: { x: true, y: true },
});
