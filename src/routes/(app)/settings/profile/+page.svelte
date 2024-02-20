<script lang="ts">
	import { page } from '$app/stores';
	import { USERNAME_REGEX } from '$lib/user.types';

	import DoneIcon from '$lib/components/icons/DoneIcon.svelte';
	import PersonChatIcon from '$lib/components/icons/PersonChatIcon.svelte';

	$: isDisplaynameSuccess =
		$page.form && $page.form.success && $page.url.search.includes('displayname');
</script>

<section class="mx-auto w-full max-w-5xl">
	<div
		class="card card-bordered mx-auto w-96 border-base-content border-opacity-20 bg-base-200 shadow-lg"
	>
		<form class="card-body" action="?/updateDisplayname" method="post">
			<div class="join">
				<label class="form-control join-item" for="newDisplayname">
					<div class="label">
						<span class="label-text">New displayname</span>
					</div>
					<div class="join">
						<span
							class="join-item inline-flex h-12 w-12 items-center justify-center !rounded-l-btn border border-base-content border-opacity-20 bg-base-100 p-2.5"
						>
							<PersonChatIcon />
						</span>
						<input
							class="input join-item input-bordered w-full"
							type="text"
							name="newDisplayname"
							id="newDisplayname"
							required
							pattern={USERNAME_REGEX.source}
						/>
					</div>
				</label>

				<button class="btn btn-primary join-item self-end" disabled={isDisplaynameSuccess}>
					{#if isDisplaynameSuccess}
						<span class="inline-block h-6 w-6">
							<DoneIcon />
						</span>
					{:else}
						Update
					{/if}
				</button>
			</div>

			{#if $page.form && !$page.form.success && $page.form.issues}
				<ul class="inline-block font-medium italic text-error">
					{#each $page.form.issues as issue}
						<li>
							{issue.message}
						</li>
					{/each}
				</ul>
			{/if}
		</form>
	</div>
</section>
