<script lang="ts">
	import type { PageData } from './$types';

	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import SettingsIcon from '$lib/components/icons/SettingsIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
			<span class="inline-block h-6 w-6 fill-stone-100">
				<PersonIcon />
			</span>
			<span>
				{data.profile.displayname}
			</span>
		</h2>
		{#if data.user && data.user.id === data.profile.id}
			<a
				class="!ml-auto inline-block h-14 w-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 fill-stone-100 p-3 transition-colors hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				title="Settings"
				href="/settings"
			>
				<SettingsIcon />
				<span class="sr-only">Settings</span>
			</a>
		{/if}
	</header>

	<ul class="flex flex-col items-center justify-center space-y-4">
		<li>
			<a class="underline" href={`/user/${data.profile.username}/library`}>Library</a>
		</li>
	</ul>
</section>
