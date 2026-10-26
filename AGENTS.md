# AGENTS.md

Monorepo for the Shapez 2 community: `apps/sveltekit` is the SvelteKit 2 + Svelte 5 (runes) application, `apps/pocketbase` owns the database service, `apps/proxy` owns Caddy, and `packages/` is reserved for future packages. The SvelteKit app provides 3D shape/blueprint viewers (Threlte/three.js), a blueprint codec, and a PocketBase-backed upload/search UI.

**Coding standards**: See [CODING_STANDARDS.md](CODING_STANDARDS.md) for conventions (language, framework, commits, testing).

## Toolchain

- Node `>=22` (enforced via `.npmrc` `engine-strict=true`).
- pnpm `11.5.3` via Corepack (`packageManager` field). Do not run `npm` or `bun`.
- Docker is required for the local DB and the CI/deploy path.

## Setup

```sh
pnpm install
cp apps/sveltekit/.env.example apps/sveltekit/.env.development  # set POCKETBASE_URL (e.g. http://localhost:8080)
pnpm dev:db                                     # root compose.yml, PocketBase on :8080
pnpm dev                                        # Vite dev on :5173
```

`.env.development` is git-ignored (`.env.*` pattern). The vars above are the only required ones and are also passed as CI secrets.

Root commands delegate SvelteKit scripts via `pnpm --filter @shapez-vortex/sveltekit`; keep scripts and app dependencies in `apps/sveltekit/package.json`. Shared ESLint, Prettier, and TypeScript base configuration lives at the root. `pnpm-workspace.yaml` whitelists `esbuild` and `sharp` builds; keep that allow-list intact or `pnpm install` will refuse to run.

## Verify (run in this order)

```sh
pnpm lint       # eslint src tests
pnpm check      # svelte-kit sync + svelte-check (8GB heap; required after dep/tsconfig changes)
pnpm format     # prettier --check src tests
pnpm test       # vitest run
pnpm build      # vite build (local: export POCKETBASE_URL first; CI: from secrets)
pnpm release    # changelogen --release --push (pushes tags and commits; needs GITHUB_TOKEN + push access)
```

In CI (`.github/workflows/ci.yml`) lint, check, format, and build run in parallel, test `needs: build`, and the `release` job depends on all five and runs only for `workflow_dispatch`. The release job runs `pnpm release`, which uses [unjs/changelogen](https://unjs.io/packages/changelogen) to bump the version in the root `package.json`, update `CHANGELOG.md`, commit+tag with `[skip-ci]` (configured via `changelog.templates.commitMessage`), and push to `main`. `build-deploy` reads the new tag from the `release` job's outputs. The root `package.json` version is the only release version and is displayed in the SvelteKit footer. `test:coverage` is local-only.

## Architecture (where to look)

- `apps/sveltekit/src/routes/(app)/...` — public pages. The parens are a SvelteKit route group, not a path segment. Do not nest another `(...)` group.
- `apps/sveltekit/src/hooks.server.ts` — PocketBase client + cookie auth, plus the protected routes (`/settings`, `/blueprint/upload`). Add new protected endpoints there.
- `apps/sveltekit/src/lib/server/blueprint.api.ts` — server-side `get`/`post`/`put` for blueprints; everything else talks to PocketBase through this module.
- `apps/pocketbase/pb_hooks/blueprints.pb.js` — JSVM hook (`onRecordUpdateRequest`) that is the single source of authz for `blueprints` updates. `blueprints.updateRule` is intentionally empty; the hook allows creators any edit, and lets any authenticated non-creator `+1` `viewCount` / `downloadCount` and `±1` `bookmarkCount` (and only those fields). New authorization logic for blueprint updates belongs here. Mounted into the container by `pocketbase.dockerfile` and bind-mounted for local dev via `compose.yml`.
- `apps/sveltekit/src/lib/blueprint.ts` + `blueprint.types.ts` — encode/decode/update of the `SHAPEZ2-1-...$` blueprint identifier (gzip + base64). Bump `GAME_VERSION` (currently `1095`) when the in-game data changes. `BLUEPRINT_TAG_NEW_SYMBOL` is the `"$"` prefix the form uses to mark a tag as "create if missing".
- `apps/sveltekit/src/lib/shape.ts` + `shape.types.ts` — shape identifier parser (e.g. `RuRuCuCu:--CrCu`).
- `apps/sveltekit/src/routes/api/v1/...` — public REST endpoints (`blueprint`, `blueprint/[id]`, `blueprint/{decode,encode,download}`, `login`, `user`).
- `apps/sveltekit/src/lib/components/{button,input,section,dialog}.ts` — class-variance-authority variants; new shared variants go here.

## Generated / non-source paths (do not hand-edit)

- `apps/sveltekit/src/lib/components/models/buildings/*.svelte` and `.../shapes/*.svelte` are produced from `apps/sveltekit/static/models/**/*.gltf` by the pipelines below. Both trees are also in `.prettierignore` — leave them alone.
- `apps/sveltekit/src/lib/assets/shaders/**/*.{vs,fs}` are GLSL shaders whitelisted by `apps/sveltekit/vite.config.ts` `assetsInclude`; treat as raw assets.
- `apps/sveltekit/resources/models/**/*.blend1` are Blender autosaves (already `.gitignore`d); never commit changes to them.
- `apps/sveltekit/.svelte-kit/` is SvelteKit-generated; safe to delete (`pnpm check` rebuilds it).

## Regenerating the model components

```sh
pnpm prepare:shapes     # apps/sveltekit/static/models/shapes/*.gltf -> apps/sveltekit/src/lib/components/models/shapes/
pnpm prepare:buildings  # apps/sveltekit/static/models/{buildings/,}*.gltf -> apps/sveltekit/src/lib/components/models/{buildings/,}
```

Both scripts are **interactive** (require typing `y` at the prompt), so they cannot run in CI. Run them locally after adding/changing `.gltf` sources.

## Tests

- Vitest, discovery `src/**/*.{test,spec}.{js,ts}` from `apps/sveltekit` (see `apps/sveltekit/vite.config.ts`).
- Tests follow the Robot + Fixture pattern — see [docs/testing.md](docs/testing.md) and [CODING_STANDARDS.md](CODING_STANDARDS.md).
- Pure-data modules (`apps/sveltekit/src/lib/blueprint.ts`, `shape.ts`, `utils.ts`) are good candidates for direct unit tests (no robots needed).

## Release / deploy (CI, for context)

On push to `main` and on PRs: lint + check + format + build → test. `workflow_dispatch` also runs `release` (`pnpm release`), then `build-deploy` (Docker images `shapez-base`, `shapez-proxy` to `ghcr.io/<owner>/...`) and `deploy` (SSH to host, `docker compose -f compose.production.yml up -d --force-recreate --pull always`). Root `compose.production.yml` extends service definitions in `apps/pocketbase/compose.yml` and `apps/proxy/compose.yml`; it does not deploy SvelteKit. SvelteKit remains on Vercel: set the project Root Directory to `apps/sveltekit` in Vercel Project Settings; `apps/sveltekit/vercel.json` cannot set Root Directory.

## Agent skills

### Issue tracker

Issues and specs live in this repository’s GitHub Issues; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
