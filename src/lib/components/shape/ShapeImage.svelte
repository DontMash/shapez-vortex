<script lang="ts">
	import { shape } from '$lib/client/actions/shape/shape-image';
	import type { ShapeIdentifier } from '$lib/shape.types';

	export let identifier: ShapeIdentifier;

	let picture: HTMLPictureElement | undefined;
	let isVisible = false;

	const observer = new IntersectionObserver((entries) => {
		const entry = entries.at(0);
		if (!entry || !entry.isIntersecting) return;

		isVisible = true;
	});
	$: {
		if (picture) {
			observer.disconnect();
			observer.observe(picture);
		}
		isVisible = !!!identifier;
	}
	$: isLoading = !!identifier;
</script>

<picture class="relative size-16" bind:this={picture}>
	{#if isLoading}
		<span class="loading absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
	{/if}
	{#if isVisible}
		<img
			class="opacity-0 [&[src]]:opacity-100"
			alt="Shape {identifier}"
			width="64"
			height="64"
			use:shape={{ identifier }}
			on:shapeload={() => (isLoading = false)}
		/>
	{/if}
</picture>
