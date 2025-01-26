<script lang="ts">
  import { Button } from 'bits-ui';
  import { version } from '$app/environment';
  import { GAME_VERSION } from '$lib/blueprint.types';
  import { button } from '$lib/components/button';
  import Logo from '$lib/components/Logo.svelte';
  import { section } from '$lib/components/section';
</script>

<footer class="border-t bg-layer px-4" id="footer">
  <div
    class="{section({
      x: true,
      y: false,
    })} grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4"
  >
    <aside class="flex flex-col justify-stretch">
      <div class="flex items-center">
        <Logo type="logomark" />
      </div>
      <p class="mt-2 max-w-60">
        A community-platform with tools to view, share & modify content of the
        game Shapez 2.
      </p>
      <p class="mt-8 lg:mt-auto">
        <i class="small">
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="https://github.com/DontMash/shapez-vortex/releases/tag/v{version}"
            title="Github Release - shapez-vortex"
            target="_blank"
            rel="noreferrer"
          >
            v{version}
          </Button.Root>
          <span>- Game Version {GAME_VERSION}</span>
        </i>
      </p>
    </aside>

    <nav class="mt-5">
      <p class="heading-6 mb-6 text-muted">Features</p>

      <ul class="space-y-3">
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="/shape"
            title="Checkout the shape viewer"
          >
            <span class="icon-[tabler--stack] text-lg" />
            Shape Viewer
          </Button.Root>
        </li>
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="/blueprint"
            title="Checkout the blueprint viewer"
          >
            <span class="icon-[tabler--schema] text-lg" />
            Blueprint Viewer
          </Button.Root>
        </li>
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="https://tobspr.io/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy policy
          </Button.Root>
        </li>
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="https://tobspr.io/imprint"
            target="_blank"
            rel="noreferrer"
          >
            Imprint
          </Button.Root>
        </li>
      </ul>
    </nav>

    <div class="mt-5">
      <p class="heading-6 mb-6 text-muted">Game</p>

      <nav>
        <span> Follow Shapez 2 </span>
        <ul class="flex gap-2">
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://shapez2.com/"
              title="Shapez 2 Website"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[tabler--world] text-lg">
                Shapez 2 Website
              </span>
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://discord.gg/shapez-2-1000343719314198548"
              title="Shapez 2 Community Discord"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--discord] text-lg">
                Shapez 2 Community Discord
              </span>
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://store.steampowered.com/app/2162800/shapez_2/"
              title="Shapez 2 on Steam"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--steam] text-lg">
                Shapez 2 on Steam
              </span>
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://www.reddit.com/r/shapezio/"
              title="Reddit - r/shapezio"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--reddit] text-lg">
                Reddit - r/shapezio
              </span>
            </Button.Root>
          </li>
        </ul>
      </nav>

      <nav>
        <span> Follow tobspr Games </span>
        <ul class="flex gap-2">
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://tobspr.io/"
              title="tobspr Games Website"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[tabler--world] text-lg"
                >tobspr Games Website</span
              >
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://x.com/tobspr"
              title="tobspr Games on X"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--x] text-lg"
                >tobspr Games on X</span
              >
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://www.youtube.com/@tobsprGames"
              title="tobspr Games YouTube"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--youtube] text-lg"
                >tobspr Games YouTube</span
              >
            </Button.Root>
          </li>
          <li>
            <Button.Root
              class={button({
                kind: 'ghost',
                intent: 'muted',
                size: 'icon-sm',
              })}
              href="https://www.patreon.com/tobsprgamess"
              title="tobspr Games Patreon"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon-[simple-icons--patreon] text-lg"
                >tobspr Games Patreon</span
              >
            </Button.Root>
          </li>
        </ul>
      </nav>

      <Button.Root
        class={button({ kind: 'link', size: 'xs' })}
        href="https://shapez2.wiki.gg/wiki/Shapez_2_Wiki"
        target="_blank"
        rel="noreferrer"
      >
        Visit Shapez 2 Wiki
      </Button.Root>
    </div>

    <nav class="mt-5 flex flex-col justify-stretch">
      <p class="heading-6 mb-6 text-muted">More</p>

      <ul class="space-y-3">
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="https://github.com/DontMash/shapez-vortex/issues"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[simple-icons--github] text-lg">GitHub</span>
            Report an issue
          </Button.Root>
        </li>
        <li>
          <Button.Root
            class={button({ kind: 'link', size: 'xs' })}
            href="https://ko-fi.com/smaschmann"
            target="_blank"
            rel="noreferrer"
          >
            <span class="icon-[simple-icons--kofi] text-lg">Ko-fi</span>
            Support me
          </Button.Root>
        </li>
      </ul>

      <p class="mt-8 flex flex-wrap items-center gap-1 sm:mt-auto small">
        Created with
        <span class="icon-[tabler--heart-filled] text-lg">love</span>
        by
        <Button.Root
          class={button({ kind: 'link', size: 'xs' })}
          href="https://soren.codes"
          target="_blank"
          rel="noreferrer">@DontMash</Button.Root
        >
      </p>
    </nav>

    <aside class="col-span-full flex justify-center mt-4">
      <Button.Root
        class={button({ kind: 'outline', intent: 'muted', size: 'icon-lg' })}
        href="#top"
        title="To the top of the page"
      >
        <span class="icon-[tabler--arrow-narrow-up] text-3xl">Top</span>
      </Button.Root>
    </aside>
  </div>
</footer>
