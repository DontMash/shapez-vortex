import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'inline-flex',
    'items-center',
    'gap-2',
    'focus-visible:outline-current',
    'focus-visible:outline-2',
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
        link: [
          'hover:underline',
          'focus-visible:underline',
          'focus-visible:-outline-offset-4',
        ],
      },
      intent: {
        primary: [],
      },
      size: {
        sm: ['rounded-xs'],
        md: ['rounded-sm'],
        lg: ['rounded-md'],
      },
    },
    compoundVariants: [
      {
        kind: ['fill', 'ghost', 'outline'],
        class: ['focus-visible:outline-offset-2'],
      },
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
        kind: 'link',
        intent: 'primary',
        class: [
          'hover:text-primary',
          'active:text-primary-active',
          'focus-visible:hover:outline-primary',
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
        type: 'icon',
        size: 'lg',
        class: ['size-16', 'p-3'],
      },
      {
        type: 'default',
        size: 'sm',
        class: ['px-2', 'py-1', 'h-12'],
      },
      {
        type: 'default',
        size: 'md',
        class: ['px-3', 'py-2', 'h-12'],
      },
      {
        kind: 'link',
        size: 'sm',
        class: ['-mx-2', '-my-1'],
      },
      {
        kind: 'link',
        size: 'md',
        class: ['-mx-3', '-my-2'],
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
