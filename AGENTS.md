# AGENTS.md

SvelteKit 2 + Svelte 5 (runes) + TypeScript app for the Shapez 2 community: 3D shape/blueprint viewers (Threlte/three.js), blueprint codec, and a PocketBase-backed upload/search UI.

## Toolchain

- Node `>=22` (enforced via `.npmrc` `engine-strict=true`).
- pnpm `11.5.3` via Corepack (`packageManager` field). Do not run `npm` or `bun`.
- Docker is required for the local DB and the CI/deploy path.

## Setup

```sh
pnpm install
cp .env.example .env   # set POCKETBASE_URL (e.g. http://localhost:8080)
pnpm dev:db            # PocketBase via resources/deployment/compose.yml on :8080
pnpm dev               # vite dev on :5173
```

`.env` is git-ignored. The vars above are the only required ones and are also passed as CI secrets.

`pnpm-workspace.yaml` whitelists `esbuild` and `sharp` builds; keep that allow-list intact or `pnpm install` will refuse to run.

## Verify (run in this order)

```sh
pnpm lint       # eslint src
pnpm check      # svelte-kit sync + svelte-check (8GB heap; required after dep/tsconfig changes)
pnpm format     # prettier --check src
pnpm test       # vitest run
pnpm build      # vite build (needs the .env vars)
pnpm release    # changelogen --release --push && changelogen gh release (local dry-run; needs GITHUB_TOKEN + push access)
```

In CI (`.github/workflows/ci.yml`) lint, check, format, and build run in parallel, test `needs: build`, and the single `release` job depends on all five plus is gated by `if: github.event_name != 'pull_request'`. The release job runs `pnpm release`, which uses [unjs/changelogen](https://unjs.io/packages/changelogen) to bump the version in `package.json`, update `CHANGELOG.md`, commit+tag with `[skip-ci]` (configured via the `changelog.templates.commitMessage` field in `package.json`), push to `main`, and create the GitHub release. `build-deploy` reads the new tag from the `release` job's outputs. The `package.json` `repository` field is what changelogen uses to target the GitHub release. `test:coverage` is local-only.

## Architecture (where to look)

- `src/routes/(app)/...` — public pages. The parens are a SvelteKit route group, not a path segment. Do not nest another `(...)` group.
- `src/hooks.server.ts` — PocketBase client + cookie auth, plus the protected routes (`/settings`, `/blueprint/upload`). Add new protected endpoints there.
- `src/lib/server/blueprint.api.ts` — server-side `get`/`post`/`put` for blueprints; everything else talks to PocketBase through this module.
- `resources/deployment/pb_hooks/blueprints.pb.js` — JSVM hook (`onRecordUpdateRequest`) that is the single source of authz for `blueprints` updates. `blueprints.updateRule` is intentionally empty; the hook allows creators any edit, and lets any authenticated non-creator `+1` `viewCount` / `downloadCount` and `±1` `bookmarkCount` (and only those fields). New authorization logic for blueprint updates belongs here. Mounted into the container by `pocketbase.dockerfile` and bind-mounted for local dev via `compose.yml`.
- `src/lib/blueprint.ts` + `blueprint.types.ts` — encode/decode/update of the `SHAPEZ2-1-...$` blueprint identifier (gzip + base64). Bump `GAME_VERSION` (currently `1095`) when the in-game data changes. `BLUEPRINT_TAG_NEW_SYMBOL` is the `"$"` prefix the form uses to mark a tag as "create if missing".
- `src/lib/shape.ts` + `shape.types.ts` — shape identifier parser (e.g. `RuRuCuCu:--CrCu`).
- `src/routes/api/v1/...` — public REST endpoints (`blueprint`, `blueprint/[id]`, `blueprint/{decode,encode,download}`, `login`, `user`).
- `src/lib/components/{button,input,section,dialog}.ts` — class-variance-authority variants; new shared variants go here.

## Generated / non-source paths (do not hand-edit)

- `src/lib/components/models/buildings/*.svelte` and `.../shapes/*.svelte` are produced from `static/models/**/*.gltf` by the pipelines below. Both trees are also in `.prettierignore` — leave them alone.
- `static/models/**/*.{vs,fs}` are GLSL vertex/fragment shaders whitelisted by `vite.config.ts` `assetsInclude`; treat as raw assets.
- `resources/models/**/*.blend1` are Blender autosaves (already `.gitignore`d); never commit changes to them.
- `.svelte-kit/` is SvelteKit-generated; safe to delete (`pnpm check` rebuilds it).

## Regenerating the model components

```sh
pnpm prepare:shapes     # static/models/shapes/*.gltf -> src/lib/components/models/shapes/
pnpm prepare:buildings  # static/models/buildings/*.gltf AND static/models/*.gltf -> src/lib/components/models/{buildings,}
```

Both scripts are **interactive** (require typing `y` at the prompt), so they cannot run in CI. Run them locally after adding/changing `.gltf` sources.

## Conventions

- Svelte 5 runes only (`$props`, `$state`, `$derived`); no Svelte 4 syntax.
- No source comments unless asked (matches existing code).
- Tailwind 4: theme tokens (`--color-*`, `--radius-*`, `--text-*`, `--leading-*`, `--font-*`) live in `src/app.css` under `@theme`. `tailwind.config.js` only customises the `@tailwindcss/typography` plugin; new colors go in `app.css`.
- `csrf: { trustedOrigins: ['*'] }` is intentional for the OAuth-style sign-in flow; do not tighten it without a replacement strategy.
- Conventional Commits are required — `changelogen` reads them and bumps `package.json` + writes `CHANGELOG.md`.

## Tests

- Vitest, discovery `src/**/*.{test,spec}.{js,ts}` (see `vite.config.ts`).
- Today the suite is a single smoke test in `src/index.test.ts`. Pure-data modules (`src/lib/blueprint.ts`, `src/lib/shape.ts`, `src/lib/utils.ts`) are good candidates for new tests.

## Release / deploy (CI, for context)

On push to `main`: lint + check + format + build → test → `release` (`pnpm release`; `changelogen --release --push` bumps the version, writes `CHANGELOG.md`, commits+tags with `[skip-ci]`, pushes to `main`; `changelogen gh release` syncs the GitHub release from `CHANGELOG.md`) → `build-deploy` (Docker images `shapez-base`, `shapez-proxy` to `ghcr.io/<owner>/...`) → `deploy` (SSH to host, `docker compose -f compose.production.yml up -d --force-recreate --pull always`). PRs run only lint/check/format/build/test. The `release` job is also reachable via `workflow_dispatch` for manual re-runs.
