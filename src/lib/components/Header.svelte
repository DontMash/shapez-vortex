<script lang="ts">
	import { page } from '$app/stores';

	import Logo from '$lib/components/Logo.svelte';
	import ShapeForm from '$lib/components/shape/ShapeForm.svelte';
	import Toaster from '$lib/components/toast/Toaster.svelte';

	import LoginIcon from '$lib/components/icons/LoginIcon.svelte';
	import LogoutIcon from '$lib/components/icons/LogoutIcon.svelte';
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
</script>

<header class="pointer-events-none sticky left-0 right-0 top-0 z-50 p-4">
	<div class="absolute left-1/2 top-[calc(100%_+_theme(spacing[8]))] z-50 -translate-x-1/2">
		<Toaster />
	</div>

	<nav
		class="relative mx-auto flex w-full max-w-5xl items-center space-x-3 rounded-4xl bg-neutral-800 bg-opacity-30 px-6 py-4 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:border-2 before:border-neutral-800 before:backdrop-blur-lg"
	>
		<div class="pointer-events-auto shrink-0">
			<Logo />
		</div>
		<div class="pointer-events-auto">
			<ShapeForm />
		</div>
		<div class="pointer-events-auto !ml-auto flex items-center space-x-2">
			{#if !$page.data.user}
				<a class="button secondary icon-only" title="Login" href="/login">
					<span class="sr-only">Login</span>
					<LoginIcon />
				</a>
			{:else}
				<a class="button secondary icon-only" title="Profile" href="/user">
					<span class="sr-only">Profile</span>
					<PersonIcon />
				</a>
				<form method="post" action="/logout">
					<button class="button secondary icon-only" title="Logout">
						<span class="sr-only">Logout</span>
						<LogoutIcon />
					</button>
				</form>
			{/if}
		</div>
	</nav>
</header>
