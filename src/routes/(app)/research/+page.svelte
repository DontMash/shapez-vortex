<script lang="ts">
	import type { Action } from 'svelte/action';
	import type { PageData } from './$types';

	import Research from '$lib/components/Research.svelte';
	import Slider from '$lib/components/Slider.svelte';

	export let data: PageData;
	let host: HTMLElement;
	let isScroll = false;
	$: {
		isScroll = !!host ? host.scrollWidth > host.offsetWidth : false;
	}
	const slider: Action<HTMLElement> = (element) => {
		const onInputDown = (_event: UIEvent) => {
			if (!slider) return;

			element.dataset.down = true.toString();
		};
		const onInputUp = (_event: UIEvent) => {
			if (!slider) return;

			element.dataset.down = false.toString();
		};
		const onInputMove = (event: UIEvent) => {
			if (!slider) return;

			const pointerEvent = event as PointerEvent;
			const down = element.dataset.down === 'true';
			if (!down) return;

			const value = -pointerEvent.movementX * (1 / window.devicePixelRatio);
			element.scrollBy(value, 0);
		};

		element.addEventListener('pointerdown', onInputDown);
		element.addEventListener('pointerup', onInputUp);
		element.addEventListener('pointerleave', onInputUp);
		element.addEventListener('pointermove', onInputMove);
	};
</script>

<section>
	<Slider>
		<Research data={data.research} />
	</Slider>
</section>
