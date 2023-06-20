<script lang="ts">
	import { ToastType } from '$lib/components/toast/toast.service';

	export let type: ToastType = ToastType.Info;

	const typeVariations: Record<ToastType, string> = {
		[ToastType.Info]: 'bg-cyan-400',
		[ToastType.Warning]: 'bg-orange-400',
		[ToastType.Error]: 'bg-red-400'
	};
</script>

<span
	class={`${typeVariations[type]} inline-block select-none rounded-2xl border-2 border-neutral-900 px-3 py-2 text-center`}
>
	<slot>Placeholder</slot>
</span>
