<script lang="ts">
  import { Button } from 'bits-ui';
  import type { BlueprintTag } from '$lib/blueprint.types';

  import { button } from '$lib/components/button';

  export let data: BlueprintTag;
</script>

<Button.Root
    class={button({kind:'outline', size:'xs'})}
  href="/blueprint/search?filter={encodeURIComponent(`tags=${data.name}`)}"
>
  #{data.name}
</Button.Root>
