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
		class="card card-bordered mx-auto w-96 border-base-content border-opacity-20 bg-base-200 shadow-lg"
	>
		<div class="card-body">
			{#if data.user && data.user.verified}
				<form action="/password-reset/?/reset" method="post">
					<input type="hidden" name="email" value={data.user.email} />
					<button class="btn btn-primary btn-block" disabled={isVerificationSuccess}>
						{#if isResetSuccess}
							<span class="inline-block h-6 w-6">
								<DoneIcon />
							</span>
						{:else}
							Request password reset
						{/if}
					</button>
				</form>
			{:else}
				<form action="?/requestVerification" method="post">
					<button class="btn btn-secondary btn-block" disabled={isVerificationSuccess}>
						{#if isVerificationSuccess}
							<span class="inline-block h-6 w-6">
								<DoneIcon />
							</span>
						{:else}
							Request verification
						{/if}
					</button>
				</form>
			{/if}

			<form class="join" action="?/requestEmail" method="post">
				<label class="form-control join-item" for="newEmail">
					<div class="label">
						<span class="label-text">New email</span>
					</div>
					<div class="join">
						<span
							class="join-item inline-flex h-12 w-12 items-center justify-center !rounded-l-btn border border-base-content border-opacity-20 bg-base-100 p-2.5"
						>
							<MailIcon />
						</span>
						<input
							class="input join-item input-bordered w-full"
							type="email"
							name="newEmail"
							id="newEmail"
							required
						/>
					</div>
				</label>

				<button class="btn btn-primary join-item self-end" disabled={isEmailSuccess}>
					{#if isEmailSuccess}
						<span class="inline-block h-6 w-6">
							<DoneIcon />
						</span>
					{:else}
						Update
					{/if}
				</button>
			</form>

			{#if $page.form && !$page.form.success && $page.form.issues}
				<ul class="text-error inline-block font-medium italic">
					{#each $page.form.issues as issue}
						<li>
							{issue.message}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</section>
