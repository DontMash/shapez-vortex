<script lang="ts">
	import { page } from '$app/stores';
	import { capitalize } from '$lib/utils';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	function isCurrent(path: string): boolean {
		return $page.url.pathname.includes(path);
	}
</script>

<section class="mx-auto grid w-full max-w-5xl grid-cols-[15rem_1fr]">
	<aside>
		<nav>
			{#key $page.url}
				<ul class="space-y-2 pr-8">
					{#each data.pages as page}
						<li>
							<a
								class={`inline-block w-full rounded-2xl border-2 outline-none transition-colors px-4 py-2 ${
									isCurrent(page.path)
										? 'border-cyan-800 bg-cyan-800 bg-opacity-70 hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-opacity-50'
										: 'border-neutral-800 bg-neutral-800 bg-opacity-50 hover:bg-opacity-80 focus-visible:bg-opacity-80 active:bg-neutral-900 active:bg-opacity-30'
								}`}
								href={page.path}>{capitalize(page.name)}</a
							>
						</li>
					{/each}
				</ul>
			{/key}
		</nav>
	</aside>
	<div>
		{#if $page.data.seo}
			<header
				class="mb-12 flex w-full items-end space-x-4 border-b-2 border-neutral-800 border-opacity-50 px-6 pb-4"
			>
				<h2 class="text-lg font-bold">
					{$page.data.seo.title}
				</h2>
			</header>
		{/if}
		<slot />
	</div>
</section>
