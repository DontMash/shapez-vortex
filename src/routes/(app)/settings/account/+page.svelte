<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { add } from '$lib/client/toast.service';

	export let data: PageData;
	let emailInputValue: string | undefined = $page.data.user?.email;

	$: isVerificationSuccess =
		$page.form && $page.form.success && $page.url.search.includes('verification');
	$: isResetSuccess = $page.form && $page.form.success && $page.url.search.includes('reset');
	$: isEmailSuccess = $page.form && $page.form.success && $page.url.search.includes('email');
</script>

<section class="mx-auto w-full max-w-5xl space-y-4">
	{#if data.user && data.user.verified}
		<form action="/password-reset/?/reset" method="post">
			<input type="hidden" name="email" value={data.user.email} />
			<button class="btn btn-primary btn-block" disabled={isResetSuccess}>
				Request password reset
			</button>
		</form>
	{:else}
		<form action="?/requestVerification" method="post">
			<button class="btn btn-secondary btn-block" disabled={isVerificationSuccess}>
				Request verification
			</button>
		</form>
	{/if}

	<form
		class="flex items-end space-x-4"
		action="?/requestEmail"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				add({ message: 'Your email change has been requested!', type: 'WARNING' });
				applyAction(result);
			};
		}}
	>
		<label class="form-control grow" for="newEmail">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<div class="input input-bordered flex items-center space-x-2">
				<span class="icon-[tabler--mail] text-2xl" />
				<input
					class="w-full"
					type="email"
					name="newEmail"
					id="newEmail"
					required
					bind:value={emailInputValue}
				/>
			</div>
		</label>

		<button
			class="btn btn-primary join-item self-end"
			disabled={emailInputValue === $page.data.user?.email || isEmailSuccess}
		>
			Update
		</button>
	</form>

	{#if $page.form && !$page.form.success && $page.form.issues}
		<ul class="inline-block font-medium italic text-error">
			{#each $page.form.issues as issue}
				<li>
					{issue.message}
				</li>
			{/each}
		</ul>
	{/if}
</section>
