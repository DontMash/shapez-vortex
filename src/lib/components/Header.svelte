<script lang="ts">
	import { page } from '$app/stores';

	import LoginIcon from '$lib/components/icons/LoginIcon.svelte';
	import LogoutIcon from '$lib/components/icons/LogoutIcon.svelte';
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import SettingsIcon from './icons/SettingsIcon.svelte';
	import UploadIcon from '$lib/components/icons/UploadIcon.svelte';
</script>

<header class="pointer-events-none sticky left-0 top-0 z-40 w-full p-4">
	<nav
		class="navbar pointer-events-auto relative mx-auto max-w-5xl rounded-4xl border border-base-content border-opacity-20 bg-base-200 bg-opacity-50 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
	>
		<div class="flex-1">
			<a class="btn btn-square btn-ghost btn-lg rounded-3xl" title="Home" href="/">
				<img class="h-16 w-16" src="/favicon.png" alt="Logo" />
			</a>
		</div>
		<div class="mr-2 flex-none space-x-4">
			{#if !$page.data.user}
				<a
					class="btn btn-square btn-ghost border-2 border-base-200 fill-base-content"
					title="Login"
					href="/login"
				>
					<span class="sr-only">Login</span>
					<span class="inline-block h-6 w-6 fill-base-content">
						<LoginIcon />
					</span>
				</a>
			{:else}
				{#if $page.data.user.verified}
					<a
						class="btn btn-square btn-primary btn-md fill-primary-content"
						title="Upload"
						href="/blueprint/upload"
					>
						<span class="sr-only">Upload</span>
						<span class="inline-block h-6 w-6 fill-base-content">
							<UploadIcon />
						</span>
					</a>
				{/if}
				<div class="dropdown dropdown-end">
					<div
						tabindex="0"
						role="button"
						class="btn btn-square btn-ghost border border-base-content border-opacity-20"
					>
						<span class="sr-only">Profile</span>
						<span class="inline-block h-6 w-6 fill-base-content">
							<PersonIcon />
						</span>
					</div>
					<ul
						class="menu dropdown-content menu-sm relative z-10 mt-8 w-56 rounded-box border border-base-300 border-opacity-30 bg-base-200 bg-opacity-30 p-2 shadow before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
					>
						<li>
							<a href="/user">
								<span class="inline-block h-6 w-6 fill-base-content">
									<PersonIcon />
								</span>
								Profile
							</a>
						</li>
						<li>
							<a href="/settings">
								<span class="inline-block h-6 w-6 fill-base-content">
									<SettingsIcon />
								</span>
								Settings
							</a>
						</li>
						<li>
							<form
								class="focus-within:bg-base-content focus-within:bg-opacity-10"
								method="post"
								action="/logout"
							>
								<span class="inline-block h-6 w-6 fill-base-content">
									<LogoutIcon />
								</span>
								<button class="text-left outline-none" type="submit">Logout</button>
							</form>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</nav>
</header>
