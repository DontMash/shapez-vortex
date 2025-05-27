<script lang="ts">
  import { Button } from 'bits-ui';
  import { button } from '$lib/components/button';

  interface Props {
    name: string;
  }

  let { name }: Props = $props();
</script>

<Button.Root
  class={button({ intent: 'accent', size: 'xs' })}
  href="/user/@{name}"
>
  @{name}
</Button.Root>
