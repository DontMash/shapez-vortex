<script lang="ts">
  import { version } from '$app/environment';
  import { GAME_VERSION } from '$lib/blueprint.types';
</script>

<footer class="bg-base-200 px-4 py-16 text-base-content" id="footer">
  <div class="footer mx-auto max-w-5xl">
    <nav>
      <h4 class="footer-title">Features</h4>
      <a
        class="link-hover link transition-colors hover:text-primary"
        href="/shape"
      >
        <span class="icon-[tabler--stack] align-text-bottom text-lg" />
        Shape Viewer
      </a>
      <a
        class="link-hover link transition-colors hover:text-primary"
        href="/blueprint"
      >
        <span class="icon-[tabler--schema] align-text-bottom text-lg" />
        Blueprint Viewer
      </a>
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
      <h4 class="footer-title">Game</h4>
      <div>
        <span> Follow Shapez 2 </span>
        <ul class="ml-1 inline-flex space-x-1.5 divide-x divide-base-content">
          <li>
            <a
              class="link transition-colors hover:text-primary"
              title="Shapez 2 Website"
              href="https://shapez2.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[tabler--world] align-text-bottom text-lg"
                >Website</span
              >
            </a>
          </li>
          <li class="pl-1.5">
            <a
              class="link transition-colors hover:text-primary"
              title="Discord Community"
              href="https://discord.gg/shapez-2-1000343719314198548"
              target="_blank"
              rel="noreferrer"
            >
              <span
                class="icon-[simple-icons--discord] align-text-bottom text-lg"
                >Discord</span
              >
            </a>
          </li>
          <li class="pl-1.5">
            <a
              class="link transition-colors hover:text-primary"
              title="Steam store-page"
              href="https://store.steampowered.com/app/2162800/shapez_2/"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--steam] align-text-bottom text-lg"
                >Steam</span
              >
            </a>
          </li>
          <li class="pl-1.5">
            <a
              class="link transition-colors hover:text-primary"
              title="r/shapezio"
              href="https://www.reddit.com/r/shapezio/"
              target="_blank"
              rel="noreferrer"
            >
              <span
                class="icon-[simple-icons--reddit] align-text-bottom text-lg"
                >Reddit</span
              >
            </a>
          </li>
        </ul>
      </div>
      <p>
        Follow tobspr Games
        <span class="ml-1 inline-flex space-x-1.5 divide-x divide-base-content">
          <a
            class="link transition-colors hover:text-primary"
            title="tobspr Games Website"
            href="https://tobspr.io/"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[tabler--world] align-text-bottom text-lg"
              >Website</span
            >
          </a>
          <a
            class="link pl-1.5 transition-colors hover:text-primary"
            title="tobspr Games on X"
            href="https://x.com/tobspr"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[simple-icons--x] align-text-bottom text-lg"
              >X</span
            >
          </a>
          <a
            class="link pl-1.5 transition-colors hover:text-primary"
            title="tobspr Games YouTube"
            href="https://www.youtube.com/@tobsprGames"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[simple-icons--youtube] align-text-bottom text-lg"
              >YouTube</span
            >
          </a>
          <a
            class="link pl-1.5 transition-colors hover:text-primary"
            title="tobspr Games Patreon"
            href="https://www.patreon.com/tobsprgamess"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[simple-icons--patreon] align-text-bottom text-lg"
              >Patreon</span
            >
          </a>
        </span>
      </p>
      <a
        class="link-hover link transition-colors hover:text-primary"
        href="https://shapez2.wiki.gg/wiki/Shapez_2_Wiki"
        target="_blank"
        rel="noreferrer"
      >
        Visit Shapez 2 Wiki
      </a>
    </nav>
    <nav>
      <h6 class="footer-title">About</h6>
      <a
        class="link-hover link transition-colors hover:text-primary"
        href="https://github.com/DontMash/shapez-vortex/issues"
        target="_blank"
        rel="noreferrer"
      >
        <span class="icon-[simple-icons--github] align-text-bottom text-lg"
          >GitHub</span
        >
        Report an issue
      </a>
      <a
        class="link-hover link transition-colors hover:text-primary"
        href="https://ko-fi.com/smaschmann"
        target="_blank"
        rel="noreferrer"
      >
        <span class="icon-[simple-icons--kofi] align-text-bottom text-lg"
          >Ko-fi</span
        >
        Support me
      </a>
      <p>
        Created with
        <span class="icon-[tabler--heart-filled] align-text-bottom text-lg"
          >love</span
        >
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
    <aside class="h-full gap-4 md:justify-self-end">
      <a
        class="btn btn-circle btn-ghost btn-lg place-self-center border-2 border-base-content fill-base-content"
        title="To top"
        href="#top"
      >
        <span class="icon-[tabler--arrow-narrow-up] text-3xl" />
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
        <span>- Game Version {GAME_VERSION}</span>
      </i>
    </aside>
  </div>
</footer>
