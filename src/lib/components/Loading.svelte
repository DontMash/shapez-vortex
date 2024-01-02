<script lang="ts">
	export let color: Color = 'light';

	type Color = 'light' | 'dark';
	const colorVariants: Record<Color, string> = {
		light: 'after:border-t-stone-100',
		dark: 'after:border-t-neutral-900'
	};
</script>

<figure
	class={`block after:block after:h-10 after:w-10 after:animate-spin after:rounded-full after:border-4 after:border-transparent ${colorVariants[color]}`}
/>
