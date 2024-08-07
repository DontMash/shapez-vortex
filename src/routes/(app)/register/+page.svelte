<script lang="ts">
	import { page } from '$app/stores';
	import { PASSWORD_MIN_LENGTH, USERNAME_REGEX } from '$lib/user.types';
	import type { PageData } from './$types';

	export let data: PageData;

	let isPasswordHidden = true;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
	>
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--edit] align-text-bottom text-2xl" />
				{data.seo.title}
			</h2>
		</hgroup>
	</header>

	<div
		class="card rounded-none border-x-0 sm:border-x sm:rounded-box transition-[border-radius] card-bordered mx-auto max-w-screen-sm border-base-content/20 bg-base-200 shadow-lg"
	>
		<form class="card-body" action="?/register" method="post">
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

			<label class="form-control" for="displayname">
				<div class="label">
					<span class="label-text">Displayname</span>
				</div>
				<div class="input input-bordered flex items-center space-x-2">
					<span class="icon-[tabler--message-user] text-2xl" />
					<input
						type="text"
						name="displayname"
						id="displayname"
						value={$page.form && !$page.form.success ? $page.form.data.displayname : null}
						required
						pattern={USERNAME_REGEX.source}
					/>
				</div>
			</label>

			<label class="form-control" for="email">
				<div class="label">
					<span class="label-text">Email</span>
				</div>
				<div class="input input-bordered flex items-center space-x-2">
					<span class="icon-[tabler--mail] text-2xl" />
					<input
						class="w-full"
						type="email"
						name="email"
						id="email"
						value={$page.form && !$page.form.success ? $page.form.data.email : null}
						required
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

			<button class="btn btn-primary my-4" title="Create your account">
				<span class="icon-[tabler--edit] text-2xl" />
				Register
			</button>

			<a class="link link-accent" href="/login"> Already have an account? </a>
		</form>
	</div>
</section>
