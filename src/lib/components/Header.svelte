<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import ShapeForm from '$lib/components/ShapeForm.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';
</script>

<header class="pointer-events-none sticky left-0 right-0 top-0 z-50">
	<div class="absolute left-1/2 -translate-x-1/2 top-[calc(100%_+_theme(spacing[8]))] z-50">
		<Toaster />
	</div>

	<nav
		class="relative mx-auto flex w-full max-w-5xl items-center space-x-4 rounded-full bg-neutral-800 bg-opacity-30 px-6 py-4 before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
	>
		<div class="pointer-events-auto">
			<Logo />
		</div>
		<div class="pointer-events-auto">
			<ShapeForm />
		</div>
	</nav>
</header>
