<script lang="ts">
	import { version } from '$app/environment';

	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import FavoriteFilledIcon from '$lib/components/icons/FavoriteFilledIcon.svelte';
	import NorthIcon from '$lib/components/icons/NorthIcon.svelte';
	import SteamIcon from '$lib/components/icons/SteamIcon.svelte';

	import RESEARCH_DATA from '$lib/assets/data/research-metadata.json';
</script>

<footer class="bg-base-200 p-10 text-base-content" id="footer">
	<div class="footer mx-auto max-w-5xl px-4">
		<nav>
			<h6 class="footer-title">Features</h6>
			<a class="link-hover link transition-colors hover:text-primary" href="/shape">Shape Viewer</a>
			<a class="link-hover link transition-colors hover:text-primary" href="/blueprint"
				>Blueprint Viewer</a
			>
			<a class="link-hover link transition-colors hover:text-primary" href="/research"
				>Research Overview</a
			>
		</nav>
		<nav>
			<h6 class="footer-title">Legal</h6>
			<a
				class="link-hover link transition-colors hover:text-primary"
				href="https://tobspr.io/imprint"
				target="_blank"
				rel="noreferrer"
			>
				Terms of use
			</a>
			<a
				class="link-hover link transition-colors hover:text-primary"
				href="https://tobspr.io/privacy"
				target="_blank"
				rel="noreferrer"
			>
				Privacy policy
			</a>
		</nav>
		<nav>
			<h6 class="footer-title">About</h6>
			<div>
				Visit shapez 2 on
				<span class="ml-1 space-x-1 divide-x-2">
					<a
						class="inline-block fill-base-content transition-colors hover:fill-primary"
						title="Discord"
						href="https://discord.gg/shapez-2-1000343719314198548"
						target="_blank"
						rel="noreferrer"
					>
						<span class="sr-only">Discord</span>
						<span class="inline-flex h-6 w-6 items-center justify-center align-middle">
							<DiscordIcon />
						</span>
					</a>
					<a
						class="inline-block fill-base-content pl-2 transition-colors hover:fill-primary"
						title="Steam"
						href="https://store.steampowered.com/app/2162800/shapez_2/"
						target="_blank"
						rel="noreferrer"
					>
						<span class="sr-only">Steam</span>
						<span class="inline-flex h-6 w-6 items-center justify-center align-middle">
							<SteamIcon />
						</span>
					</a>
				</span>
			</div>
			<p>
				Created with
				<span class="inline-block h-4 w-4 align-middle">
					<span class="sr-only">heart</span>
					<FavoriteFilledIcon />
				</span>
				by
				<a
					class="link-hover link transition-colors hover:text-primary"
					href="https://soren.codes"
					target="_blank"
					rel="noreferrer"
				>
					@DontMash
				</a>
			</p>
			<i>
				<a
					class="link-hover link transition-colors hover:text-primary"
					title="Github - DontMash - shapez-visualizer"
					href="https://github.com/DontMash/shapez-visualizer"
					target="_blank"
					rel="noreferrer"
				>
					v{version}
				</a>
				<span>- Game Version {RESEARCH_DATA.GameVersion}</span>
			</i>
		</nav>
		<aside class="place-self-center">
			<a
				class="btn btn-circle btn-ghost btn-lg border-2 border-base-content fill-base-content"
				title="To top"
				href="#top"
			>
				<span class="inline-block h-8 w-8">
					<NorthIcon />
				</span>
			</a>
		</aside>
	</div>
</footer>
