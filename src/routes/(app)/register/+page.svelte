<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { PASSWORD_MIN_LENGTH, USERNAME_REGEX } from '$lib/user.types';

	import MailIcon from '$lib/components/icons/MailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import PersonIcon from '$lib/components/icons/PersonIcon.svelte';
	import PersonChatIcon from '$lib/components/icons/PersonChatIcon.svelte';
	import VisibilityIcon from '$lib/components/icons/VisibilityIcon.svelte';
	import VisibilityOffIcon from '$lib/components/icons/VisibilityOffIcon.svelte';
	import EditIcon from '$lib/components/icons/EditIcon.svelte';

	export let data: PageData;

	let isPasswordHidden = true;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6 fill-stone-100">
					<EditIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
		</hgroup>
	</header>

	<form
		class="grid auto-rows-auto grid-cols-2 gap-x-6 gap-y-2 rounded-4xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-30 p-6 shadow-lg"
		method="post"
		action="?/register"
	>
		<label
			class="relative mt-6 flex h-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="username"
		>
			<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">Username</span>
			<span
				class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
			>
				<PersonIcon />
			</span>
			<input
				class="peer h-full w-full bg-transparent pl-3 pr-10 outline-none"
				type="text"
				name="username"
				id="username"
				required
				value={$page.form && !$page.form.success ? $page.form.data.username : null}
				pattern={USERNAME_REGEX.source}
			/>
		</label>
		<label
			class="relative mt-6 flex h-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="displayname"
		>
			<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">Displayname</span>
			<span
				class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
			>
				<PersonChatIcon />
			</span>
			<input
				class="peer h-full w-full bg-transparent pl-3 pr-10 outline-none"
				type="text"
				name="displayname"
				id="displayname"
				value={$page.form && !$page.form.success ? $page.form.data.displayname : null}
				required
				pattern={USERNAME_REGEX.source}
			/>
		</label>
		<label
			class="relative mt-6 flex h-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
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
		<label
			class="relative mt-6 flex h-14 rounded-2xl border-2 border-neutral-800 bg-neutral-800 bg-opacity-50 leading-none transition-colors focus-within:bg-opacity-80 hover:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30"
			for="password"
		>
			<span class="absolute left-0 top-0 -translate-y-full pb-1.5 pl-3">Password</span>
			<span
				class="inline-block h-full w-14 shrink-0 border-r-2 border-neutral-800 fill-stone-100 p-3"
			>
				<PasswordIcon />
			</span>
			<input
				class="peer h-full w-full bg-transparent pl-3 pr-12 outline-none"
				type={isPasswordHidden ? 'password' : 'text'}
				name="password"
				id="password"
				value={$page.form && !$page.form.success ? $page.form.data.password : null}
				placeholder=""
				required
				minlength={PASSWORD_MIN_LENGTH}
			/>
			<button
				class="absolute right-0 top-1/2 mr-3 w-6 -translate-y-1/2 fill-stone-100 peer-placeholder-shown:hidden"
				type="button"
				title={isPasswordHidden ? 'Show password' : 'Hide password'}
				on:click={() => (isPasswordHidden = !isPasswordHidden)}
			>
				<span class="sr-only">{isPasswordHidden ? 'Show' : 'Hide'}</span>
				{#if isPasswordHidden}
					<VisibilityIcon />
				{:else}
					<VisibilityOffIcon />
				{/if}
			</button>
		</label>
		<button class="button primary col-span-2 mt-6">Register</button>

		{#if $page.form && !$page.form.success && $page.form.issues}
			<ul class="inline-block px-3 font-medium italic text-red-700">
				{#each $page.form.issues as issue}
					<li>
						{issue.message}
					</li>
				{/each}
			</ul>
		{/if}
		
		<span class="col-span-2 px-3 pt-3">
			<a
				class="underline transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
				href="/login"
			>
				Already have an account?
			</a>
		</span>
	</form>
</section>
