import { cva } from 'class-variance-authority';

export const button = cva(
  [
    'inline-flex',
    'justify-center',
    'items-center',
    'gap-2',
    'focus-visible:outline-2',
    'focus-visible:outline',
    'transition',
  ],
  {
    variants: {
      kind: {
        fill: [],
        outline: ['border', 'focus-visible:outline-foreground'],
        ghost: [
          'border',
          'border-transparent',
          'hover:bg-border',
          'focus-visible:outline-foreground',
        ],
        link: [
          'hover:underline',
          'focus-visible:underline',
          'focus-visible:outline-foreground',
          'focus-visible:outline-offset-4',
        ],
      },
      intent: {
        primary: [],
        secondary: [],
        accent: [],
        muted: [],
        error: [],
      },
      size: {
        'icon-sm': ['rounded-xs', 'size-8', 'p-1'],
        icon: ['rounded-sm', 'size-12', 'p-1'],
        'icon-lg': ['rounded-md', 'size-16', 'p-3'],
        xs: ['rounded-xs'],
        sm: ['rounded-xs'],
        md: ['rounded-sm'],
        lg: ['rounded-md'],
      },
      block: {
        false: ['inline-flex'],
        true: ['flex'],
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
        kind: 'fill',
        intent: 'accent',
        class: [
          'bg-accent',
          'text-accent-foreground',
          'hover:bg-accent-hover',
          'active:bg-accent-active',
          'focus-visible:outline-accent',
          'focus-visible:hover:outline-accent-hover',
          'focus-visible:active:outline-accent-active',
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
        ],
      },
      {
        kind: 'outline',
        intent: 'error',
        class: [
          'hover:bg-error',
          'hover:border-error',
          'hover:text-error-foreground',
          'active:bg-error-active',
          'focus-visible:hover:outline-error',
        ],
      },
      {
        kind: ['fill', 'ghost', 'outline'],
        size: 'xs',
        class: ['px-1', 'py-0.5', 'h-6'],
      },
      {
        kind: ['fill', 'ghost', 'outline'],
        size: 'sm',
        class: ['px-2', 'py-1', 'h-12'],
      },
      {
        kind: ['fill', 'ghost', 'outline'],
        size: 'md',
        class: ['px-3', 'py-2', 'h-12'],
      },
      {
        kind: ['fill', 'ghost', 'outline'],
        size: 'lg',
        class: ['px-5', 'py-3', 'h-12'],
      },
    ],
    defaultVariants: {
      kind: 'fill',
      intent: 'primary',
      size: 'md',
    },
  },
);
