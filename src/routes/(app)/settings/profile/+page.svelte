<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { USERNAME_REGEX } from '$lib/user.types';
	import { add } from '$lib/client/toast/toast.service';

	import PersonChatIcon from '$lib/components/icons/PersonChatIcon.svelte';

	let displaynameInputValue: string | undefined = $page.data.user?.displayname;
</script>

<section class="mx-auto w-full max-w-5xl space-y-4">
	<form
		class="flex items-end space-x-4"
		action="?/updateDisplayname"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				add('Your displayname has been updated!');
				applyAction(result);
			};
		}}
	>
		<label class="form-control grow" for="newDisplayname">
			<div class="label">
				<span class="label-text">Displayname</span>
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
					bind:value={displaynameInputValue}
				/>
			</div>
		</label>

		<button
			class="btn btn-primary join-item self-end"
			disabled={displaynameInputValue === $page.data.user?.displayname || $page.form?.success}
		>
			Update
		</button>

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
</section>
