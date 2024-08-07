<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { type Mesh, type Object3D } from 'three';
	import { Canvas, T, type ThrelteContext } from '@threlte/core';
	import { OrbitControls, Suspense } from '@threlte/extras';
	import { page } from '$app/stores';
	import { copy } from '$lib/client/actions/clipboard';
	import { fullscreen } from '$lib/client/actions/fullscreen';
	import { add } from '$lib/client/toast.service';
	import {
		isHexShapeIdentifier,
		SHAPE_COLOR_BASE_MATERIAL,
		type ShapeData
	} from '$lib/shape.types';

	import ShapePart from '$lib/components/shape/ShapePart.svelte';
	import ShapeDefaultSupport from '$lib/components/models/shapes/ShapeDefaultSupport.svelte';

	const SHAPE_LAYER_HEIGHT = 0.05;
	const SHAPE_LAYER_SCALE = 0.2;
	const SHAPE_LAYER_EXTEND_OFFSET = 0.15;
	const SHAPE_PART_EXPAND_OFFSET = 0.15;

	export let data: ShapeData;
	export let isExtended = false;
	export let isExpanded = false;

	$: isHex = isHexShapeIdentifier(data.identifier);

	let ctx: ThrelteContext | undefined;
	let viewer: HTMLElement | undefined;
	let orbitControls: OrbitControls | undefined;
	let baseComponentModel: SvelteComponent | undefined;
	let isFullscreen: boolean = false;

	function onCapture() {
		ctx?.renderer.domElement.toBlob(
			(blob) => {
				if (!blob) return;

				const items = { [blob.type]: blob };
				const clipboardItem = new ClipboardItem(items);
				navigator.clipboard
					.write([clipboardItem])
					.then(() => add({ message: 'Copied shape image' }))
					.catch(() => add({ message: 'Error while creating shape image', type: 'ERROR' }));
			},
			'image/png',
			1
		);
	}
	function onReset() {
		if (!orbitControls) return;

		orbitControls.ref.reset();
	}
	function onTop() {
		if (!orbitControls) return;

		orbitControls.ref.object.position.set(0, 2.5, 0);
	}

	const onBaseModelLoad = () => {
		if (!baseComponentModel) {
			throw new Error('[SHAPEVIEW] model not loaded');
		}
		const object = baseComponentModel.ref as Object3D;
		const mesh = object.children[0] as Mesh;
		mesh.material = SHAPE_COLOR_BASE_MATERIAL;
	};
</script>

<figure class="{isFullscreen ? '' : ''} relative" bind:this={viewer}>

	<div class="left-0 top-0 z-10 flex h-fit flex-wrap justify-center gap-4 sm:absolute">
		<div class="join">
			<form class="btn btn-square btn-primary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={!isExtended} />
				<input name="expand" type="hidden" value={isExpanded} />
				<button
					class="h-full w-full"
					title="{isExtended ? 'Contract' : 'Extend'} layers"
					type="submit"
				>
					{#if isExtended}
						<span class="icon-[tabler--stack-forward] align-text-bottom text-2xl" />
					{:else}
						<span class="icon-[tabler--stack] align-text-bottom text-2xl" />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<input name="extend" type="hidden" value={isExtended} />
				<input name="expand" type="hidden" value={!isExpanded} />
				<button
					class="h-full w-full"
					title="{isExpanded ? 'Collapse' : 'Expand'} Parts"
					type="submit"
				>
					{#if isExpanded}
						<span class="icon-[tabler--border-none] align-text-bottom text-2xl" />
					{:else}
						<span class="icon-[tabler--border-all] align-text-bottom text-2xl" />
					{/if}
				</button>
			</form>
			<form class="btn btn-square btn-primary join-item" method="post" action="/shape/?/random">
				<button class="h-full w-full" title="Randomize shape" type="submit">
					<span class="icon-[tabler--arrows-shuffle] align-text-bottom text-2xl">Shuffle</span>
				</button>
			</form>
		</div>

		<div class="join">
			<button
				class="btn btn-square btn-secondary join-item"
				title="Copy shape"
				use:copy={{ value: data.identifier }}
				on:copy={() => add({ message: 'Shape identifier copied' })}
				on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
			>
				<span class="icon-[tabler--copy] text-2xl" />
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				title="Capture shape"
				on:click={onCapture}
			>
				<span class="icon-[tabler--camera] text-2xl" />
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				type="button"
				title={`Turn fullscreen ${isFullscreen ? 'off' : 'on'}`}
				use:fullscreen={{ fullscreenElement: viewer }}
				on:change={(event) => (isFullscreen = event.detail)}
				on:error={(event) => add({ message: event.detail.message, type: 'ERROR' })}
			>
				{#if isFullscreen}
					<span class="icon-[material-symbols--fullscreen-exit-rounded] text-2xl" />
				{:else}
					<span class="icon-[material-symbols--fullscreen-rounded] text-2xl" />
				{/if}
			</button>
			<button
				class="btn btn-square btn-secondary join-item"
				type="button"
				title="View top down"
				on:click={onTop}
			>
				<span class="icon-[tabler--circle] text-2xl" />
			</button>
			<form class="btn btn-square btn-secondary join-item" action="/shape">
				<input name="identifier" type="hidden" value={data.identifier} />
				<button class="h-full w-full" title="Reset controls" type="submit" on:click={onReset}>
					<span class="icon-[tabler--reload] align-text-bottom text-2xl" />
				</button>
			</form>
		</div>

		<form class="join">
			<label
				class="input join-item input-bordered flex items-center space-x-2"
				for="shape-identifier"
				aria-label="Shape identifier"
			>
				<input
					class="grow"
					type="text"
					id="shape-identifier"
					name="identifier"
					placeholder="Shape code..."
					value={$page.data.shape?.identifier ?? null}
					required
					minlength="2"
					maxlength="51"
				/>

				<button class="btn btn-square btn-ghost btn-sm" type="reset" title="Clear shape input">
					<span class="icon-[tabler--x] text-lg" />
				</button>
			</label>
			<button class="btn btn-square btn-accent join-item">
				<span class="icon-[tabler--arrow-narrow-right] text-2xl" />
			</button>
		</form>
	</div>
	
	<div class="aspect-h-1 aspect-w-1">
		<div class="h-full bg-base-100">
			<Canvas rendererParameters={{ preserveDrawingBuffer: true }} bind:ctx>
				<T.PerspectiveCamera makeDefault position={[0, 2, 1.5]} fov={55}>
					<OrbitControls
						enablePan={false}
						enableZoom={false}
						enableDamping
						maxPolarAngle={Math.PI * 0.4}
						bind:this={orbitControls}
					/>
				</T.PerspectiveCamera>

				<T.AmbientLight intensity={1} />
				<T.DirectionalLight
					position={[1, 3, 1]}
					intensity={2}
					castShadow
					shadow.mapSize={[2048, 2048]}
				/>

				<Suspense on:load={onBaseModelLoad}>
					<ShapeDefaultSupport position.y={-0.025} bind:this={baseComponentModel} />
				</Suspense>
				{#key data}
					{#each data.data as layer, layerIndex}
						{@const layerPositionY = layerIndex * SHAPE_LAYER_HEIGHT}
						{@const layerScale = 1 - layerIndex * SHAPE_LAYER_SCALE}
						{@const extendOffset = isExtended ? layerIndex * SHAPE_LAYER_EXTEND_OFFSET : 0}
						{@const expandOffset = isExpanded ? SHAPE_PART_EXPAND_OFFSET : 0}
						<T.Group
							position.y={layerPositionY + extendOffset}
							scale={[layerScale, 0.5, layerScale]}
						>
							{#each layer as part, partIndex}
								<T.Group rotation.y={partIndex * (isHex ? -1 / 3 : -0.5) * Math.PI + Math.PI}>
									<ShapePart data={part} {isHex} offset={expandOffset} />
								</T.Group>
							{/each}
						</T.Group>
					{/each}
				{/key}
			</Canvas>
		</div>
	</div>

	<figcaption class="sr-only">Shape Viewer: {data.identifier}</figcaption>
</figure>
