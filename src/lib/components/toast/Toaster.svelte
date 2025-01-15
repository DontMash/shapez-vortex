<script lang="ts">
  import { toastStore, type ToastType } from '$lib/client/toast.service';

  const ALERT_TYPES: Record<ToastType, string> = {
    INFO: 'alert-info',
    SUCCESS: 'alert-success',
    WARNING: 'alert-warning',
    ERROR: 'alert-error',
  };
</script>

<div class="toast-right toast toast-bottom z-50">
  {#each $toastStore.reverse() as toast}
    <div role="alert" class="alert {ALERT_TYPES[toast.type]} text-base-content">
      {#if toast.type === 'SUCCESS'}
        <span class="icon-[tabler--check] text-2xl">Check</span>
      {:else if toast.type === 'WARNING'}
        <span class="icon-[tabler--alert-triangle] text-2xl">Warning</span>
      {:else if toast.type === 'ERROR'}
        <span class="icon-[tabler--circle-x] text-2xl">Error</span>
      {:else}
        <span class="icon-[tabler--info-circle] text-2xl">Info</span>
      {/if}
      <span class="max-w-full truncate">
        {toast.message}
      </span>
    </div>
  {/each}
</div>
