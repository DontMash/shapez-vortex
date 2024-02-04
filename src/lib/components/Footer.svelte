<script lang="ts">
	import { version } from '$app/environment';

	import FavoriteFilledIcon from '$lib/components/icons/FavoriteFilledIcon.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import SteamIcon from '$lib/components/icons/SteamIcon.svelte';

	import RESEARCH_DATA from '$lib/assets/data/research-metadata.json';
</script>

<footer class="mx-auto grid w-full max-w-5xl grid-cols-3 gap-2 p-4 text-xs" id="footer">
	<div class="flex items-center">
		<span>Visit shapez 2 on</span>
		<ul class="flex divide-x divide-stone-100 leading-none">
			<li>
				<a
					class="inline-flex h-6 w-10 fill-stone-100 px-2 transition-colors hover:fill-cyan-400 focus-visible:fill-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
					title="Discord"
					href="https://discord.gg/shapez-2-1000343719314198548"
					target="_blank"
					rel="noreferrer"
				>
					<span class="sr-only">Discord</span>
					<DiscordIcon />
				</a>
			</li>
			<li>
				<a
					class="inline-flex h-6 w-10 fill-stone-100 px-2 transition-colors hover:fill-cyan-400 focus-visible:fill-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
					title="Steam"
					href="https://store.steampowered.com/app/2162800/shapez_2/"
					target="_blank"
					rel="noreferrer"
				>
					<span class="sr-only">Steam</span>
					<SteamIcon />
				</a>
			</li>
		</ul>
	</div>
	<div class="flex items-center justify-center space-x-[0.25ch]">
		<span> Created with </span>
		<figure class="inline-block w-4 fill-stone-100">
			<span class="sr-only">heart</span>
			<FavoriteFilledIcon />
		</figure>
		<span> by </span>
		<a
			class="underline transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
			href="https://soren.codes"
			target="_blank"
			rel="noreferrer"
		>
			@DontMash
		</a>
	</div>
	<i class="flex space-x-1 items-center justify-end">
		<a
			class="underline transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
			title="Github - DontMash - shapez-visualizer"
			href="https://github.com/DontMash/shapez-visualizer"
			target="_blank"
			rel="noreferrer"
		>
			v{version}
		</a>
		<span>- Game Version {RESEARCH_DATA.GameVersion}</span>
	</i>
	<ul class="space-y-1">
		<li>
			<a
				class="underline transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
				href="https://tobspr.io/imprint"
				target="_blank"
				rel="noreferrer">Imprint</a
			>
		</li>
		<li>
			<a
				class="underline transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-100"
				href="https://tobspr.io/privacy"
				target="_blank"
				rel="noreferrer">Privacy</a
			>
		</li>
	</ul>
</footer>
