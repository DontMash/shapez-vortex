<script lang="ts">
	import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;
</script>

<section class="mx-auto w-full max-w-5xl">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-input px-4 pb-4">
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--upload] align-text-bottom text-2xl" />
				{data.seo.title}
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<div class="grid grid-cols-2 gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Upload Blueprint</Card.Title>
				<Card.Description>Share your blueprint with the community.</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button href="/blueprint/upload">Start</Button>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Upload scenario</Card.Title>
				<Card.Description>Share your scenario with the community.</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button href="/scenario/upload">Start</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</section>
