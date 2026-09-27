<script lang="ts">
  import { copy } from '$lib/client/actions/clipboard.svelte';
  import { add } from '$lib/client/toast.service';

  import { button } from '$lib/components/button';

  interface Props {
    value: string;
  }

  let { value }: Props = $props();

  let isLoading = $state(false);
</script>

<button
  class="{button({
    kind: 'ghost',
    intent: 'muted',
    size: 'icon-sm',
  })} data-[loading=true]:animate-spin"
  data-loading={isLoading}
  type="button"
  title="Copy"
  onclick={() => (isLoading = true)}
  {@attach copy({
    value,
    oncopy: () => {
      isLoading = false;
      add({ message: 'Content copied' });
    },
    onerror: (error) => {
      isLoading = false;
      add({ message: error.message, type: 'ERROR' });
    },
  })}
>
  <span class="icon-[tabler--copy] text-2xl">Copy</span>
</button>
