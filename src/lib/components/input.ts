import { cva } from 'class-variance-authority';

export const group = cva([
  'group',
  'flex',
  'h-12',
  'items-center',
  'gap-2',
  'rounded-md',
  'border',
  'bg-background',
  'px-4',
  'transition',
  'focus-within:outline',
  'focus-within:outline-2',
  'focus-within:outline-offset-2',
  'hover:cursor-pointer',
]);
export const field = cva([
  'h-full',
  'w-full',
  'bg-transparent',
  'outline-none',
  'transition',
  'placeholder:text-muted',
  'placeholder:transition',
  'group-hover:placeholder:text-muted-foreground',
]);
