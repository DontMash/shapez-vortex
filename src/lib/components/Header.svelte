<script lang="ts">
	import { Command } from 'cmdk-sv';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isShapeIdentifier } from '$lib/shape.types';

	import Dialog from '$lib/components/Dialog.svelte';

	const OPERATING_SYSTEMS = ['Mac OS', 'Windows', 'Linux'] as const;
	$: os = $page.data.agent?.os;

	let searchModal: Dialog;
	let searchValue = '';

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
				title="Upload your content"
				href="/upload"
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
						class="menu dropdown-content menu-sm relative !-right-4 z-10 mt-8 w-56 space-y-1 rounded-btn border border-base-content/30 bg-base-200/20 p-2 shadow before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-lg"
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

<Dialog align="top" on:close={() => (searchValue = '')} bind:this={searchModal}>
	<Command.Root class="min-h-64" label="Search" loop>
		<div class="flex items-center border-b border-base-200 pb-4 pl-8 pt-6">
			<span class="icon-[tabler--search] text-lg" />
			<Command.Input
				class="w-full bg-transparent pl-2 pr-16 outline-none"
				placeholder="Search the vortex ..."
				bind:value={searchValue}
			/>
		</div>

		<Command.List class="p-4 [&_[data-cmdk-group]+[data-cmdk-group]]:mt-4">
			<Command.Empty class="text-center">No results found.</Command.Empty>

			{#if searchValue}
				{@const blueprints = $page.data.searchBlueprints}
				{#if blueprints.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Blueprints" alwaysRender>
						{#each blueprints as blueprint}
							<Command.Item
								class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
								id={blueprint.id}
								value={blueprint.title}
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
						<Command.Item
							class="btn btn-ghost btn-block mt-1 justify-start aria-selected:bg-neutral"
							alwaysRender
							onSelect={() => command(() => searchBlueprints(searchValue))}
						>
							<span class="icon-[tabler--search] text-lg" />
							Browse more...
						</Command.Item>
					</Command.Group>
				{/if}

				{@const users = $page.data.searchUsers}
				{#if users.length > 0}
					<Command.Group class="[&>[data-cmdk-group-heading]]:text-xs" heading="Users">
						{#each users as user}
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
		</Command.List>
	</Command.Root>
</Dialog>
