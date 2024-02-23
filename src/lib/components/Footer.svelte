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
			<p>
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
						<span class="inline-flex h-5 w-5 items-center justify-center align-middle">
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
						<span class="inline-flex h-5 w-5 items-center justify-center align-middle">
							<SteamIcon />
						</span>
					</a>
				</span>
			</p>
			<a
				class="link-hover link transition-colors hover:text-primary"
				href="https://github.com/DontMash/shapez-vortex/issues"
				target="_blank"
				rel="noreferrer"
			>
				Report an issue
			</a>
			<p>
				Created with
				<span class="inline-block h-5 w-5 align-middle">
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
		</nav>
		<aside class="h-full">
			<a
				class="btn btn-circle btn-ghost btn-lg place-self-center border-2 border-base-content fill-base-content"
				title="To top"
				href="#top"
			>
				<span class="inline-block h-8 w-8">
					<NorthIcon />
				</span>
			</a>
			<i class="mt-auto">
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
		</aside>
	</div>
</footer>
