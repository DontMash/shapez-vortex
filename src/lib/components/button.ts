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
      kind: {
        fill: [],
        outline: ['border'],
        ghost: ['border', 'border-transparent', 'hover:bg-border'],
        link: [
          'hover:underline',
          'focus-visible:underline',
          'focus-visible:-outline-offset-4',
        ],
      },
      intent: {
        primary: [],
        secondary: [],
        accent: [],
        muted: [],
      },
      size: {
        'icon-sm': ['justify-center', 'rounded-xs', 'size-8', 'p-1'],
        icon: ['justify-center', 'rounded-sm', 'size-12', 'p-1'],
        'icon-lg': ['justify-center', 'rounded-sm', 'size-16', 'p-3'],
        sm: ['rounded-xs', 'px-2', 'py-1', 'h-12'],
        md: ['rounded-sm', 'px-3', 'py-2', 'h-12'],
        lg: ['rounded-md', 'px-5', 'py-3', 'h-12'],
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
          'text-primary-foreground',
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
        kind: 'outline',
        intent: 'primary',
        class: [
          'hover:bg-primary',
          'hover:border-primary',
          'hover:text-primary-foreground',
          'active:bg-primary-active',
          'focus-visible:hover:outline-primary',
          'focus-visible:active:outline-primary-active',
        ],
      },
      {
        kind: 'outline',
        intent: 'secondary',
        class: [
          'hover:bg-secondary',
          'hover:border-secondary',
          'hover:text-secondary-foreground',
          'active:bg-secondary-active',
          'focus-visible:hover:outline-secondary',
          'focus-visible:active:outline-secondary-active',
        ],
      },
      {
        kind: 'outline',
        intent: 'muted',
        class: [
          'hover:bg-muted',
          'hover:border-muted',
          'hover:text-muted-foreground',
          'active:bg-muted-active',
          'focus-visible:hover:outline-muted',
          'focus-visible:active:outline-muted-active',
        ],
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
      kind: 'fill',
      intent: 'primary',
      size: 'md',
    },
  },
);
