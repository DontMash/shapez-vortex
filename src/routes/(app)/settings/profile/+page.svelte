<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { USERNAME_REGEX } from '$lib/user.types';

	import DoneIcon from '$lib/components/icons/DoneIcon.svelte';
	import PersonChatIcon from '$lib/components/icons/PersonChatIcon.svelte';
	import DataObjectIcon from '$lib/components/icons/DataObjectIcon.svelte';

	export let data: PageData;

	$: isDisplaynameSuccess =
		$page.form && $page.form.success && $page.url.search.includes('displayname');
</script>

<section class="mx-auto w-full max-w-5xl">
	<div
		class="space-y-4 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
	>
		<form class="flex items-end space-x-4" method="post" action="?/displayname">
			<label
				class="relative mt-6 flex h-14 w-full rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				for="newDisplayname"
			>
				<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">New displayname</span>
				<span
					class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
				>
					<PersonChatIcon />
				</span>
				<input
					class="peer h-full w-full bg-transparent pl-3 pr-10 outline-none"
					type="text"
					name="newDisplayname"
					id="newDisplayname"
					required
					pattern={USERNAME_REGEX.source}
				/>
			</label>
			<button class="button primary h-14" disabled={isDisplaynameSuccess}>
				{#if isDisplaynameSuccess}
					<span class="inline-block h-7 w-7">
						<DoneIcon />
					</span>
				{:else}
					Update
				{/if}
			</button>
		</form>
		{#if $page.form && !$page.form.success && $page.form.issues}
			<ul class="inline-block px-3 font-medium italic text-red-700">
				{#each $page.form.issues as issue}
					<li>
						{issue.message}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
