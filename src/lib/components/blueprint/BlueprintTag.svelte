<script lang="ts">
  import { Button } from 'bits-ui';
  import type { BlueprintTag } from '$lib/blueprint';

  import { button } from '$lib/components/button';

  interface Props {
    data: BlueprintTag;
  }

  let { data }: Props = $props();
</script>

<Button.Root
  class={button({ kind: 'outline', size: 'xs' })}
  href="/blueprint/search?filter={encodeURIComponent(`tags=${data.name}`)}"
>
  #{data.name}
</Button.Root>
