<script lang="ts">
	import { version } from '$app/environment';

	import FavoriteFilledIcon from '$lib/components/icons/FavoriteFilledIcon.svelte';

	import RESEARCH_DATA from '$lib/assets/data/research-metadata.json';
</script>

<footer class="mx-auto grid w-full max-w-7xl grid-cols-3 p-4 text-xs" id="footer">
	<div class="col-start-2 flex items-center justify-center space-x-[0.25ch]">
		<span> Created with </span>
		<figure class="inline-block w-4 fill-stone-100">
			<FavoriteFilledIcon />
		</figure>
		<span> by </span>
		<a
			class="inline-block underline transition hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
			href="https://soren.codes"
			target="_blank"
			rel="noreferrer"
		>
			@DontMash
		</a>
	</div>
	<i class="text-end">v{version} - Game Version {RESEARCH_DATA.GameVersion}</i>
</footer>
