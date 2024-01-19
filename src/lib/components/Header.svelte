<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import ShapeForm from '$lib/components/shape/ShapeForm.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';

	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
</script>

<header class="pointer-events-none sticky left-0 right-0 top-0 z-50 p-4">
	<div class="absolute left-1/2 top-[calc(100%_+_theme(spacing[8]))] z-50 -translate-x-1/2">
		<Toaster />
	</div>

	<nav
		class="relative mx-auto flex w-full max-w-5xl items-center space-x-3 rounded-[2rem] bg-neutral-800 bg-opacity-30 pl-6 pr-8 py-4 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:border-2 before:border-neutral-800 before:backdrop-blur-lg"
	>
		<div class="pointer-events-auto shrink-0">
			<Logo />
		</div>
		<div class="pointer-events-auto">
			<ShapeForm />
		</div>
		<div class="pointer-events-auto !ml-auto flex items-center">
			<a
				class="inline-block h-14 w-14 rounded-2xl border-2 border-neutral-700 border-opacity-50 bg-neutral-800 fill-stone-100 p-3 hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-opacity-30 transition-colors"
					title="Profile"
					href="/profile"
			>
				<span class="sr-only">Profile</span>
				<PersonIcon />
			</a>
		</div>
	</nav>
</header>
