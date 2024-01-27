<script lang="ts">
	import type { Action } from 'svelte/action';
	import type { PageData } from './$types';

	import Research from '$lib/components/research/Research.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import ScienceIcon from '$lib/components/icons/ScienceIcon.svelte';

	export let data: PageData;
	let host: HTMLElement;
	let isScroll = false;
	$: {
		isScroll = !!host ? host.scrollWidth > host.offsetWidth : false;
	}
	const slider: Action<HTMLElement, any> = (element) => {
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
	<header
		class="max-w-5xl mx-auto mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<ScienceIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<Slider>
		<Research data={data.research} />
	</Slider>
</section>
