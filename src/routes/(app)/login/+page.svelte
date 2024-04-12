<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { PASSWORD_MIN_LENGTH, USERNAME_REGEX } from '$lib/user.types';

	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';
	import VisibilityOffIcon from '$lib/components/icons/VisibilityOffIcon.svelte';
	import LoginIcon from '$lib/components/icons/LoginIcon.svelte';

	export let data: PageData;

	let isPasswordHidden = true;
	function getRedirectParam(page: Page) {
		return page.url.searchParams.get('redirect');
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4">
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6">
					<LoginIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
		</hgroup>
	</header>

	<div
		class="card card-bordered mx-auto max-w-lg border-base-content border-opacity-20 bg-base-200 shadow-lg"
	>
		<form class="card-body" action="?/login" method="post">
			{#if getRedirectParam($page)}
				<input type="hidden" name="redirect" value={getRedirectParam($page)} />
			{/if}

			<label class="form-control" for="username">
				<div class="label">
					<span class="label-text">Username</span>
				</div>
				<div class="join">
					<span
						class="join-item inline-flex h-12 w-12 items-center justify-center border border-base-content border-opacity-20 bg-base-100 p-2.5"
					>
						<PersonIcon />
					</span>
					<input
						class="input join-item input-bordered w-full"
						type="text"
						name="username"
						id="username"
						required
						value={$page.form && !$page.form.success ? $page.form.data.username : null}
						pattern={USERNAME_REGEX.source}
					/>
				</div>
			</label>

			<label class="form-control" for="password">
				<div class="label">
					<span class="label-text">Password</span>
				</div>
				<div class="join relative">
					<span
						class="join-item inline-flex h-12 w-12 items-center justify-center border border-base-content border-opacity-20 bg-base-100 p-2.5"
					>
						<PasswordIcon />
					</span>
					<input
						class="input join-item input-bordered w-full !rounded-r-btn pr-12"
						type={isPasswordHidden ? 'password' : 'text'}
						name="password"
						id="password"
						value={$page.form && !$page.form.success ? $page.form.data.password : null}
						placeholder=""
						required
						minlength={PASSWORD_MIN_LENGTH}
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<button
							class="btn btn-square btn-ghost btn-sm"
							type="button"
							title={isPasswordHidden ? 'Show password' : 'Hide password'}
							on:click={() => (isPasswordHidden = !isPasswordHidden)}
						>
							<span class="sr-only">{isPasswordHidden ? 'Show' : 'Hide'}</span>
							<span class="inline-block h-6 w-6">
								{#if isPasswordHidden}
									<VisibilityOffIcon />
								{:else}
									<VisibilityIcon />
								{/if}
							</span>
						</button>
					</div>
				</div>
			</label>

			{#if $page.form && !$page.form.success && $page.form.issues}
				<ul class="inline-block font-medium italic text-error">
					{#each $page.form.issues as issue}
						<li>
							{issue.message}
						</li>
					{/each}
				</ul>
			{/if}

			<button class="btn btn-primary my-4">Login</button>

			<a class="link link-accent" href="/register"> Create an account? </a>
			<a class="link link-accent" href="/password-reset"> Forgot your password? </a>
		</form>
	</div>
</section>
