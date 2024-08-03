<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { add } from '$lib/client/toast/toast.service';
	import { USERNAME_REGEX } from '$lib/user.types';

	let displaynameInputValue: string | undefined = $page.data.user?.displayname;
</script>

<section class="mx-auto w-full max-w-5xl space-y-4">
	<form
		class="flex items-end space-x-4"
		action="?/updateDisplayname"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				add({ message: 'Your displayname has been updated!' });
				applyAction(result);
			};
		}}
	>
		<label class="form-control grow" for="newDisplayname">
			<div class="label">
				<span class="label-text">Displayname</span>
			</div>
			<div class="input input-bordered flex items-center space-x-2">
				<span class="icon-[tabler--message-user] text-2xl" />
				<input
					class="w-full"
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
