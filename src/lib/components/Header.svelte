<script lang="ts">
	import { Command } from 'cmdk-sv';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { debounce } from '$lib/utils';
	import type { BlueprintData } from '$lib/blueprint.types';
	import type { User } from '$lib/user.types';
	import { TOAST_TYPE, add } from '$lib/client/toast/toast.service';

	import Dialog from '$lib/components/Dialog.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import DomainIcon from '$lib/components/icons/DomainIcon.svelte';
	import LoginIcon from '$lib/components/icons/LoginIcon.svelte';
	import LogoutIcon from '$lib/components/icons/LogoutIcon.svelte';
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import ScienceIcon from '$lib/components/icons/ScienceIcon.svelte';
	import SettingsIcon from '$lib/components/icons/SettingsIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import UploadIcon from '$lib/components/icons/UploadIcon.svelte';
	import { isShapeIdentifier } from '$lib/shape.types';

	const MAX_ENTRIES = 5;
	const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
	$: os = $page.data.agent?.os;

	let searchModal: Dialog;
	let searchValue = '';
	let searchLoading = false;

	let blueprints: Array<Pick<BlueprintData, 'id' | 'title' | 'expand'>> = [];
	let users: Array<Pick<User, 'username' | 'displayname'>> = [];
	$: {
		searchLoading = true;
		searchValue;

		update();
	}

	const update = debounce(async () => {
		await updateBlueprints(searchValue);
		await updateUsers(searchValue);

		searchLoading = false;
	}, 500);
	async function updateBlueprints(search: string) {
		if (!browser) return [];

		const url = new URL('/api/v1/blueprint/search', $page.url.origin);
		url.searchParams.append('title', search);
		try {
			const response = await fetch(url.href);
			const result = await response.json();
			blueprints = result.items;
		} catch (err) {
			blueprints = [];
			add('Failed to search blueprints', 3000, TOAST_TYPE.ERROR);
		}
	}
	async function updateUsers(search: string) {
		if (!browser) return [];

		const url = new URL('/api/v1/user/search', $page.url.origin);
		url.searchParams.append('displayname', search);
		try {
			const response = await fetch(url.href);
			const result = await response.json();
			users = result.items;
		} catch (err) {
			users = [];
			add('Failed to search users', 3000, TOAST_TYPE.ERROR);
		}
	}
	function searchBlueprints(search: string) {
		const url = new URL('/blueprint/search', $page.url.origin);
		url.searchParams.append('title', search);
		goto(url.href);
	}
	function command(callback: () => void) {
		searchModal.close();
		callback();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!os || !os.name) return;

		switch (event.key) {
			case 'k':
				if (
					(os.name === OPERATING_SYSTEMS[0] && event.metaKey) ||
					((os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]) && event.ctrlKey)
				) {
					searchModal.show();
				}
				break;
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<header class="pointer-events-none sticky left-0 top-0 z-40 w-full p-4">
	<nav
		class="navbar pointer-events-auto relative mx-auto max-w-5xl rounded-4xl border border-base-content border-opacity-20 bg-base-200 bg-opacity-50 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
	>
		<div class="flex-1">
			<a class="btn btn-square btn-ghost btn-lg rounded-3xl" title="Home" href="/">
				<img class="inline-block h-16 w-16" src="/favicon.png" alt="Logo" />
			</a>
		</div>

		<div class="mr-2 flex-none space-x-4">
			<button
				class="btn btn-ghost border border-base-content border-opacity-20"
				type="button"
				on:click={() => searchModal.show()}
			>
				<span class="inline-block size-6">
					<SearchIcon />
				</span>
				Search ...
				{#if os && os.name && OPERATING_SYSTEMS.find((value) => value === os?.name)}
					<span>
						{#if os.name === OPERATING_SYSTEMS[0]}
							<kbd class="kbd rounded-md">⌘</kbd>
						{/if}
						{#if os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]}
							<kbd class="kbd rounded-md">Ctrl</kbd>
						{/if}
						<kbd class="kbd rounded-md">K</kbd>
					</span>
				{/if}
			</button>

			{#if !$page.data.user}
				<a
					class="btn btn-square btn-ghost border border-base-content border-opacity-20 fill-base-content"
					title="Login"
					href="/login"
				>
					<span class="sr-only">Login</span>
					<span class="inline-block size-6 fill-base-content">
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
						<span class="inline-block size-6 fill-primary-content">
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
						<span class="inline-block size-6 fill-base-content">
							<PersonIcon />
						</span>
					</div>
					<ul
						class="menu dropdown-content menu-sm relative z-10 mt-8 w-56 space-y-1 rounded-btn border border-base-content border-opacity-30 bg-base-200 bg-opacity-20 p-2 shadow before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
					>
						<li>
							<a href="/user">
								<span class="inline-block size-6 fill-base-content">
									<PersonIcon />
								</span>
								Profile
							</a>
						</li>
						<li>
							<a href="/settings">
								<span class="inline-block size-6 fill-base-content">
									<SettingsIcon />
								</span>
								Settings
							</a>
						</li>
						<li>
							<form
								class="focus-within:bg-base-content focus-within:bg-opacity-10"
								action="/logout"
								method="post"
							>
								<span class="inline-block size-6 fill-base-content">
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

<Dialog on:close={() => (searchValue = '')} bind:this={searchModal}>
	<Command.Root class="min-h-64" label="Search">
		<div class="flex items-center border-b border-base-200 pb-4 pl-8 pt-6">
			<span class="inline-block size-6">
				<SearchIcon />
			</span>
			<Command.Input
				class="w-full bg-transparent pl-2 pr-16 outline-none"
				placeholder="Search the vortex ..."
				bind:value={searchValue}
			/>
		</div>
		<Command.List class="p-4 [&_[data-cmdk-group]+[data-cmdk-group]]:mt-4">
			{#if searchLoading}
				<Command.Loading class="text-center">
					<div class="loading loading-spinner" />
				</Command.Loading>
			{:else}
				<Command.Empty class="text-center">No results found.</Command.Empty>

				{#if blueprints.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Blueprints">
						{#each blueprints.slice(0, MAX_ENTRIES) as blueprint}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								onSelect={() => command(() => goto(`/blueprint/${blueprint.id}`))}
							>
								<span class="inline-block size-6">
									<DomainIcon />
								</span>
								{blueprint.title}
								{#if blueprint.expand && blueprint.expand['creator']}
									<span class="badge badge-accent badge-outline badge-sm">
										@{blueprint.expand['creator'].displayname}
									</span>
								{/if}
							</Command.Item>
						{/each}
						{#if blueprints.length > MAX_ENTRIES}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								value={searchValue}
								onSelect={() => command(() => searchBlueprints(searchValue))}
							>
								<span class="inline-block size-6">
									<SearchIcon />
								</span>
								Find more ...
							</Command.Item>
						{/if}
					</Command.Group>
				{/if}

				{#if users.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Users">
						{#each users.slice(0, MAX_ENTRIES) as user}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								onSelect={() => command(() => goto(`/user/${user.username}`))}
							>
								<span class="inline-block size-6">
									<PersonIcon />
								</span>
								{user.displayname}
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}

				<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Features">
					{#if isShapeIdentifier(searchValue)}
					<Command.Item
						class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
						onSelect={() => command(() => goto(`/shape?identifier=${searchValue}`))}
					>
						<span class="inline-block size-6">
							<CategoryIcon />
						</span>
						View Shape - {searchValue}
					</Command.Item>
					{:else}
					<Command.Item
						class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
						onSelect={() => command(() => goto('/shape'))}
					>
						<span class="inline-block size-6">
							<CategoryIcon />
						</span>
						Shape Viewer
					</Command.Item>
					{/if}
					<Command.Item
						class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
						onSelect={() => command(() => goto('/blueprint'))}
					>
						<span class="inline-block size-6">
							<DomainIcon />
						</span>
						Blueprint Viewer
					</Command.Item>
					<Command.Item
						class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
						onSelect={() => command(() => goto('/research'))}
					>
						<span class="inline-block size-6">
							<ScienceIcon />
						</span>
						Research Overview
					</Command.Item>

					{#if $page.data.user}
						{#if $page.data.user.verified}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								onSelect={() => command(() => goto('/blueprint/upload'))}
							>
								<span class="inline-block size-6">
									<UploadIcon />
								</span>
								Upload
							</Command.Item>
						{/if}
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							onSelect={() => command(() => goto('/user'))}
						>
							<span class="inline-block size-6">
								<PersonIcon />
							</span>
							Profile
						</Command.Item>
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							onSelect={() => command(() => goto('/settings'))}
						>
							<span class="inline-block size-6">
								<SettingsIcon />
							</span>
							Settings
						</Command.Item>
					{/if}
				</Command.Group>
			{/if}
		</Command.List>
	</Command.Root>
</Dialog>
