<script lang="ts">
  import { blur } from 'svelte/transition';
  import ToastService, {
    type Toast,
    type ToastType,
  } from '$lib/client/toast.svelte';
  import { section } from '$lib/components/section';

  const TOAST_DELAY = 500;
  const TOAST_BACKGROUND: Record<ToastType, string> = {
    INFO: 'bg-layer/70',
    SUCCESS: 'bg-success/70 text-success-foreground',
    WARNING: 'bg-warning/70 text-warning-foreground',
    ERROR: 'bg-error/70 text-error-foreground',
  };

  const toastService = ToastService.instance;
  let toast = $state<Toast | undefined>();
  let timeout = $state<ReturnType<typeof setTimeout> | undefined>();

  $effect(() => {
    if (!toastService.queue.length || toast) {
      return;
    }

    if (timeout) {
      return;
    }

    toast = toastService.use();
    if (!toast) {
      return;
    }

    timeout = setTimeout(() => {
      toast = undefined;
      setTimeout(() => {
        clearTimeout(timeout);
        timeout = undefined;
      }, TOAST_DELAY);
    }, toast?.duration);
  });
</script>

<div class="{section({ y: false })} fixed inset-x-0 bottom-4 z-50">
  {#if toast}
    <div
      class="{TOAST_BACKGROUND[
        toast.type
      ]} flex w-fit max-w-(--breakpoint-sm) items-center gap-2 rounded-sm border p-4 backdrop-blur-lg"
      role="alert"
      transition:blur={{ duration: 150 }}
    >
      {#if toast.type === 'SUCCESS'}
        <span class="icon-[tabler--check]">Success</span>
      {:else if toast.type === 'WARNING'}
        <span class="icon-[tabler--alert-triangle]">Warning</span>
      {:else if toast.type === 'ERROR'}
        <span class="icon-[tabler--circle-x]">Error</span>
      {:else}
        <span class="icon-[tabler--info-circle]">Info</span>
      {/if}
      <span class="truncate">
        {toast.message}
      </span>
    </div>
  {/if}
</div>
