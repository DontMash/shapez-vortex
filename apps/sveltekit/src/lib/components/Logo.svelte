<script lang="ts">
  import { Button } from 'bits-ui';
  import { cva, type VariantProps } from 'class-variance-authority';

  import logoAsset from '$lib/assets/images/logo.png';

  type LogoVariant = VariantProps<typeof logo>;
  const logo = cva(
    [
      'flex',
      'items-center',
      'gap-2',
      'border',
      'border-transparent',
      'rounded-sm',
      'transition',
      'hover:bg-border',
      'focus-visible:outline-current',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-solid',
    ],
    {
      variants: {
        type: {
          logo: ['size-12'],
          logomark: ['p-1'],
        },
      },
      defaultVariants: {
        type: 'logo',
      },
    },
  );

  interface Props {
    type?: LogoVariant['type'];
  }

  let { type = 'logo' }: Props = $props();
</script>

<Button.Root class={logo({ type })} href="/" title="To the frontpage">
  <img
    class="inline-block"
    src={logoAsset}
    alt="Shapez Vortex Logo"
    width="48"
    height="48"
  />
  <span class="heading-4" class:sr-only={type !== 'logomark'}
    >Shapez Vortex</span
  >
</Button.Root>
