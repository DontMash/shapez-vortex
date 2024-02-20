<script lang="ts">
	import type { PageData } from './$types';

	import LockResetIcon from '$lib/components/icons/LockResetIcon.svelte';
	import { page } from '$app/stores';
	import MailIcon from '$lib/components/icons/MailIcon.svelte';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header
		class="mb-12 flex w-full items-end space-x-4 border-b border-base-content border-opacity-20 px-6 pb-4"
	>
		<hgroup>
			<h2 class="inline-flex items-center space-x-2 text-lg font-bold">
				<span class="inline-block h-6 w-6">
					<LockResetIcon />
				</span>
				<span>
					{data.seo.title}
				</span>
			</h2>
		</hgroup>
	</header>

	<div
		class="card card-bordered mx-auto w-96 border-base-content border-opacity-20 bg-base-200 shadow-lg"
	>
		<form class="card-body" method="post" action="?/reset">
			<label class="form-control" for="email">
				<div class="label">
					<span class="label-text">Email</span>
				</div>
				<div class="join">
					<span
						class="join-item inline-flex h-12 w-12 items-center justify-center border border-base-content border-opacity-20 bg-base-100 p-2.5"
					>
						<MailIcon />
					</span>
					<input
						class="input join-item input-bordered w-full"
						type="email"
						name="email"
						id="email"
						value={$page.form && !$page.form.success ? $page.form.data.email : null}
						required
					/>
				</div>
			</label>

			{#if $page.form && !$page.form.success && $page.form.issues}
				<ul class="text-error inline-block font-medium italic">
					{#each $page.form.issues as issue}
						<li>
							{issue.message}
						</li>
					{/each}
				</ul>
			{/if}

			<button class="btn btn-primary mt-4">Request</button>
		</form>
	</div>
</section>
