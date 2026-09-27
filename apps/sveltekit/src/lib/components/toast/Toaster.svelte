<script lang="ts">
  import { blur } from 'svelte/transition';
  import { toastStore, type ToastType } from '$lib/client/toast.service';
  import { section } from '$lib/components/section';

  const ALERT_TYPES: Record<ToastType, string> = {
    INFO: 'bg-layer/70',
    SUCCESS: 'bg-success/70 text-success-foreground',
    WARNING: 'bg-warning/70 text-warning-foreground',
    ERROR: 'bg-error/70 text-error-foreground',
  };
</script>

<div class="{section({ y: false })} fixed inset-x-0 bottom-4 z-50">
  {#if $toastStore}
    <div
      class="{ALERT_TYPES[
        $toastStore.type
      ]} flex w-fit max-w-(--breakpoint-sm) items-center gap-2 rounded-sm border p-4 backdrop-blur-lg"
      role="alert"
      transition:blur={{ duration: 150 }}
    >
      {#if $toastStore.type === 'SUCCESS'}
        <span class="icon-[tabler--check]">Success</span>
      {:else if $toastStore.type === 'WARNING'}
        <span class="icon-[tabler--alert-triangle]">Warning</span>
      {:else if $toastStore.type === 'ERROR'}
        <span class="icon-[tabler--circle-x]">Error</span>
      {:else}
        <span class="icon-[tabler--info-circle]">Info</span>
      {/if}
      <span class="truncate">
        {$toastStore.message}
      </span>
    </div>
  {/if}
</div>
