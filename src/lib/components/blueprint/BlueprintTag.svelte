<script lang="ts">
  import type { BlueprintTag } from '$lib/blueprint.types';

  export let data: BlueprintTag;
</script>

<a
  class="badge link-hover badge-primary badge-outline"
  href="/blueprint/search?filter={encodeURIComponent(`tags=${data.name}`)}"
>
  #{data.name}
</a>
