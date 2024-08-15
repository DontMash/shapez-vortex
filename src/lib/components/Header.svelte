<script lang="ts">
	import { Command } from 'cmdk-sv';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { debounce } from '$lib/utils';
	import { add } from '$lib/client/toast.service';
	import type { BlueprintRecord } from '$lib/blueprint.types';
	import { isShapeIdentifier } from '$lib/shape.types';
	import type { User } from '$lib/user.types';

	import Dialog from '$lib/components/Dialog.svelte';

	const MAX_ENTRIES = 5;
	const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
	$: os = $page.data.agent?.os;

	let searchModal: Dialog;
	let searchValue = '';
	let searchLoading = false;

	let blueprints: Array<Pick<BlueprintRecord, 'id' | 'title' | 'expand'>> = [];
	let users: Array<Pick<User, 'displayname'>> = [];
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
		if (!browser || !search) {
			blueprints = [];
			return;
		}

		const url = new URL('/api/v1/blueprint', $page.url.origin);
		url.searchParams.append('query', search);
		try {
			const response = await fetch(url.href);
			const result = await response.json();
			blueprints = result.items;
		} catch (err) {
			blueprints = [];
			add({ message: 'Failed to search blueprints', type: 'ERROR' });
		}
	}
	async function updateUsers(search: string) {
		if (!browser || !search) {
			users = [];
			return;
		}

		const url = new URL('/api/v1/user', $page.url.origin);
		url.searchParams.append('displayname', search);
		try {
			const response = await fetch(url.href);
			const result = await response.json();
			users = result.items;
		} catch (err) {
			users = [];
			add({ message: 'Failed to search users', type: 'ERROR' });
		}
	}
	function searchBlueprints(search: string) {
		const url = new URL('/blueprint/search', $page.url.origin);
		url.searchParams.append('query', search);
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
					event.preventDefault();
					searchModal.show();
				}
				break;
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<header class="pointer-events-none sticky left-0 top-0 z-40 w-full p-4">
	<nav
		class="navbar pointer-events-auto relative mx-auto max-w-5xl rounded-4xl border border-base-content/20 bg-base-200/50 shadow-lg before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
	>
		<div class="flex-1">
			<a class="btn btn-square btn-ghost btn-lg rounded-3xl" title="Home" href="/">
				<img class="inline-block" src="/favicon.png" alt="Logo" />
			</a>
		</div>

		<div class="mr-2 flex-none space-x-4">
			<button
				class="btn btn-ghost border border-base-content/20"
				title="Search Shapez Vortex"
				type="button"
				on:click={() => searchModal.show()}
			>
				<span class="icon-[tabler--search] text-2xl" />
				Search
				{#if os && os.name && OPERATING_SYSTEMS.find((value) => value === os?.name)}
					<span class=" hidden sm:block">
						{#if os.name === OPERATING_SYSTEMS[0]}
							<kbd class="kbd kbd-sm rounded-md">⌘</kbd>
						{/if}
						{#if os.name === OPERATING_SYSTEMS[1] || os.name === OPERATING_SYSTEMS[2]}
							<kbd class="kbd kbd-sm rounded-md">Ctrl</kbd>
						{/if}
						<kbd class="kbd kbd-sm rounded-md">K</kbd>
					</span>
				{/if}
			</button>

			<a
				class="btn btn-square btn-primary btn-md fill-primary-content"
				title="Upload a blueprint"
				href="/blueprint/upload"
			>
				<span class="icon-[tabler--upload] text-2xl">Upload</span>
			</a>
			{#if !$page.data.user}
				<a
					class="btn btn-square btn-primary btn-md fill-primary-content"
					title="Login"
					href="/login"
				>
					<span class="icon-[tabler--login-2] text-2xl">Login</span>
				</a>
			{/if}
			{#if $page.data.user}
				<div class="dropdown dropdown-end">
					<div
						tabindex="0"
						title="Open user menu"
						role="button"
						class="btn btn-square btn-ghost border border-base-content/20"
					>
						<span class="icon-[tabler--user] text-2xl">User</span>
					</div>
					<ul
						class="menu dropdown-content menu-sm !-right-4 relative z-10 mt-8 w-56 space-y-1 rounded-btn border border-base-content/30 bg-base-200/20 p-2 shadow before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
					>
						<li>
							<a title="Go to your user profile" href="/user">
								<span class="icon-[tabler--user] text-lg" />
								Profile
							</a>
						</li>
						<li>
							<a title="Go to your user settings" href="/settings">
								<span class="icon-[tabler--settings] text-lg" />
								Settings
							</a>
						</li>
						<li>
							<form class="focus-within:bg-base-content/10" action="/logout" method="post">
								<span class="icon-[tabler--logout-2] text-lg" />
								<button class="text-left outline-none" title="Logout" type="submit">Logout</button>
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
			<span class="icon-[tabler--search] text-lg" />
			<Command.Input
				class="w-full bg-transparent pl-2 pr-16 outline-none"
				placeholder="Search the vortex ..."
				bind:value={searchValue}
			/>
		</div>
		<Command.List class="p-4 [&_[data-cmdk-group]+[data-cmdk-group]]:mt-4">
			{#if searchLoading}
				<Command.Loading class="text-center">
					<span class="loading loading-spinner">Loading...</span>
				</Command.Loading>
			{:else}
				<Command.Empty class="text-center">No results found.</Command.Empty>

				{#if blueprints.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Blueprints">
						{#each blueprints.slice(0, MAX_ENTRIES) as blueprint}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								value={blueprint.title + blueprint.id}
								onSelect={() => command(() => goto(`/blueprint/${blueprint.id}`))}
							>
								<span class="icon-[tabler--schema] text-lg" />
								{blueprint.title}
								{#if blueprint.expand && blueprint.expand['creator']}
									<span class="badge badge-accent badge-outline badge-sm">
										@{blueprint.expand['creator'].displayname}
									</span>
								{/if}
							</Command.Item>
						{/each}
						{#if blueprints.length > 0}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								value={searchValue}
								onSelect={() => command(() => searchBlueprints(searchValue))}
							>
								<span class="icon-[tabler--search] text-lg" />
								Browse more...
							</Command.Item>
						{/if}
					</Command.Group>
				{/if}

				{#if users.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Users">
						{#each users.slice(0, MAX_ENTRIES) as user}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								onSelect={() => command(() => goto(`/user/@${user.displayname}`))}
							>
								<span class="icon-[tabler--user] text-lg" />
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
							<span class="icon-[tabler--stack] text-lg" />
							View Shape - {searchValue}
						</Command.Item>
					{:else}
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							onSelect={() => command(() => goto('/shape'))}
						>
							<span class="icon-[tabler--stack] text-lg" />
							Shape Viewer
						</Command.Item>
					{/if}
					<Command.Item
						class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
						onSelect={() => command(() => goto('/blueprint'))}
					>
						<span class="icon-[tabler--schema] text-lg" />
						Blueprint Viewer
					</Command.Item>

					{#if $page.data.user}
						{#if $page.data.user.verified}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								onSelect={() => command(() => goto('/blueprint/upload'))}
							>
								<span class="icon-[tabler--upload] text-lg" />
								Upload
							</Command.Item>
						{/if}
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							onSelect={() => command(() => goto('/user'))}
						>
							<span class="icon-[tabler--user] text-lg" />
							Profile
						</Command.Item>
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							onSelect={() => command(() => goto('/settings'))}
						>
							<span class="icon-[tabler--settings] text-lg" />
							Settings
						</Command.Item>
					{/if}
				</Command.Group>
			{/if}
		</Command.List>
	</Command.Root>
</Dialog>
