<script lang="ts">
	import type { PageData } from './$types';

	import LockResetIcon from '$lib/components/icons/LockResetIcon.svelte';
	import { page } from '$app/stores';
	import MailIcon from '$lib/components/icons/MailIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<LockResetIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
		</hgroup>
	</header>

	<form
		class="flex items-end space-x-4 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
		method="post"
		action="?/reset"
	>
		<label
			class="relative mt-6 flex h-14 w-full rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="email"
		>
			<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">Email</span>
			<span
				class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
			>
				<MailIcon />
			</span>
			<input
				class="peer h-full w-full bg-transparent pl-3 pr-10 outline-none"
				type="email"
				name="email"
				id="email"
				value={$page.form && !$page.form.success ? $page.form.data.email : null}
				required
			/>
		</label>

		{#if $page.form && !$page.form.success && $page.form.issues}
			<ul class="inline-block px-3 font-medium italic text-red-700">
				{#each $page.form.issues as issue}
					<li>
						{issue.message}
					</li>
				{/each}
			</ul>
		{/if}

		<button class="button primary h-14">Request</button>
	</form>
</section>
