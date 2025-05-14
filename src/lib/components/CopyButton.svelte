<script lang="ts">
  import { copy } from '$lib/client/actions/clipboard';
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
  use:copy={{ value }}
  oncopy={() => {
    isLoading = false;
    add({ message: 'Content copied' });
  }}
  onerror={(event) => {
    isLoading = false;
    add({ message: event.detail.message, type: 'ERROR' });
  }}
>
  <span class="icon-[tabler--copy] text-2xl">Copy</span>
</button>
