import { cva } from 'class-variance-authority';

export const group = cva(
  [
    'group/input',
    'flex',
    'items-center',
    'gap-2',
    'rounded-sm',
    'border',
    'bg-background',
    'transition',
    'focus-within:outline-solid',
    'focus-within:outline-2',
    'focus-within:outline-offset-2',
  ],
  {
    variants: {
      type: {
        text: ['cursor-text'],
        file: [
          'cursor-pointer',
          'hover:bg-foreground',
          'hover:text-background',
        ],
      },
      size: {
        sm: ['min-h-8', 'px-2'],
        md: ['min-h-12', 'px-4'],
      },
    },
    defaultVariants: {
      type: 'text',
      size: 'md',
    },
  },
);
export const field = cva([
  'h-full',
  'w-full',
  'bg-transparent',
  'outline-hidden',
  'transition',
  'placeholder:text-muted',
  'placeholder:transition',
  'group-hover/input:placeholder:text-muted-foreground',
]);
