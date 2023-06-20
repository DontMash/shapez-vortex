<script lang="ts">
	import FavoriteFilledIcon from '$lib/components/icons/FavoriteFilledIcon.svelte';
</script>

<footer class="group flex items-center justify-center space-x-[0.25ch] p-4 text-xs" id="footer">
	<span> Created with </span>
	<figure class="inline-block w-4 fill-stone-100">
		<FavoriteFilledIcon />
	</figure>
	<span> by </span>
	<a
		class="inline-block underline transition hover:text-cyan-400 focus-visible:outline-dashed focus-visible:text-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
		href="https://soren.codes"
		target="_blank"
		rel="noreferrer"
	>
		@DontMash
	</a>
</footer>
