<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { PASSWORD_MIN_LENGTH, USERNAME_REGEX } from '$lib/user.types';

	export let data: PageData;

	let isPasswordHidden = true;
	function getRedirectParam(page: Page) {
		return page.url.searchParams.get('redirect');
	}
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<hgroup>
			<h2 class="text-lg font-bold">
				{data.seo.title}
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
				<div class="input input-bordered flex items-center space-x-2">
					<span class="icon-[tabler--user] text-2xl" />
					<input
						class="w-full"
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
				<div class="input input-bordered flex items-center space-x-2">
					<span class="icon-[tabler--password] text-2xl" />
					<input
						class="w-full"
						type={isPasswordHidden ? 'password' : 'text'}
						name="password"
						id="password"
						value={$page.form && !$page.form.success ? $page.form.data.password : null}
						placeholder=""
						required
						minlength={PASSWORD_MIN_LENGTH}
					/>
					<button
						class="btn btn-square btn-ghost btn-sm"
						type="button"
						title={isPasswordHidden ? 'Show password' : 'Hide password'}
						on:click={() => (isPasswordHidden = !isPasswordHidden)}
					>
						<span class="sr-only">{isPasswordHidden ? 'Show' : 'Hide'}</span>
						{#if isPasswordHidden}
							<span class="icon-[tabler--eye-off] text-lg">Password is shown</span>
						{:else}
							<span class="icon-[tabler--eye] text-lg">Password is hidden</span>
						{/if}
					</button>
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

			<button class="btn btn-primary my-4" title="Login to your account">
				<span class="icon-[tabler--login-2] text-2xl" />
				Login
			</button>

			<div class="flex justify-between">
				<a class="link link-accent" href="/register"> Create an account? </a>
				<a class="link link-accent" href="/password-reset"> Forgot your password? </a>
			</div>
		</form>
	</div>
</section>
