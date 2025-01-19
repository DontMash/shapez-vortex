import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'inline-flex',
    'items-center',
    'gap-2',
    'rounded-sm',
    'focus-visible:outline-current',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline',
    'transition',
  ],
  {
    variants: {
      type: {
        default: [],
        icon: ['justify-center'],
      },
      kind: {
        fill: [],
        outline: ['border', 'hover:bg-border'],
        ghost: ['border', 'border-transparent', 'hover:bg-border'],
      },
      intent: {
        primary: [],
      },
      size: {
        sm: [],
        md: [],
      },
    },
    compoundVariants: [
      {
        kind: 'fill',
        intent: 'primary',
        class: [
          'bg-primary',
          'hover:bg-primary-hover',
          'active:bg-primary-active',
          'focus-visible:outline-primary',
          'focus-visible:hover:outline-primary-hover',
          'focus-visible:active:outline-primary-active',
        ],
      },
      {
        type: 'icon',
        size: 'sm',
        class: ['size-8', 'p-1'],
      },
      {
        type: 'icon',
        size: 'md',
        class: ['size-12', 'p-1'],
      },
      {
        type: 'default',
        size: 'md',
        class: ['px-3', 'py-2', 'h-12'],
      },
    ],
    defaultVariants: {
      type: 'default',
      kind: 'fill',
      intent: 'primary',
      size: 'md',
    },
  },
);
