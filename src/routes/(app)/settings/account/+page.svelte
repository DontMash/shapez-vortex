<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import DoneIcon from '$lib/components/icons/DoneIcon.svelte';
	import MailIcon from '$lib/components/icons/MailIcon.svelte';

	export let data: PageData;

	$: isVerificationSuccess =
		$page.form && $page.form.success && $page.url.search.includes('verification');
	$: isResetSuccess = $page.form && $page.form.success && $page.url.search.includes('reset');
	$: isEmailSuccess = $page.form && $page.form.success && $page.url.search.includes('email');
</script>

<section class="mx-auto w-full max-w-5xl">
	<div
		class="space-y-4 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
	>
		{#if data.user && data.user.verified}
			<form method="post" action="/password-reset/?/reset">
				<input type="hidden" name="email" value={data.user.email} />
				<button class="button primary h-14 w-full" disabled={isVerificationSuccess}>
					{#if isResetSuccess}
						<span class="inline-block h-7 w-7">
							<DoneIcon />
						</span>
					{:else}
						Request password reset
					{/if}
				</button>
			</form>
		{:else}
			<form method="post" action="?/verification">
				<button class="button primary h-14 w-full" disabled={isVerificationSuccess}>
					{#if isVerificationSuccess}
						<span class="inline-block h-7 w-7">
							<DoneIcon />
						</span>
					{:else}
						Request verification
					{/if}
				</button>
			</form>
		{/if}

		<form class="flex items-end space-x-4" method="post" action="?/email">
			<label
				class="relative mt-6 flex h-14 w-full rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
				for="newEmail"
			>
				<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">New email</span>
				<span
					class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
				>
					<MailIcon />
				</span>
				<input
					class="peer h-full w-full bg-transparent pl-3 pr-10 outline-none"
					type="email"
					name="newEmail"
					id="newEmail"
					required
				/>
			</label>
			<button class="button primary h-14" disabled={isEmailSuccess}>
				{#if isEmailSuccess}
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
