<script lang="ts">
	import { page } from '$app/stores';
	import { capitalize } from '$lib/utils';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	function isCurrent(path: string): boolean {
		return $page.url.pathname.includes(path);
	}
</script>

<section
	class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:gap-4 px-4 md:grid-cols-[15rem_1fr] lg:px-0"
>
	<aside>
		<nav>
			{#key $page.url}
				<ul class="menu space-y-2 py-0 pl-0 pr-4">
					{#each data.pages as page}
						<li>
							<a class={isCurrent(page.path) ? 'bg-base-300/20' : ''} href={page.path}
								>{capitalize(page.name)}</a
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
				class="mb-12 flex w-full items-end space-x-4 border-b border-base-content/20 px-4 pb-4"
			>
				<h2 class="text-lg font-bold">
					{$page.data.seo.title}
				</h2>
			</header>
		{/if}
		<slot />
	</div>
</section>
