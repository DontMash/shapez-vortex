# Agents

This file provides instructions for AI coding agents working on the shapez-vortex codebase.

## Project Overview

Shapez Vortex is a community web platform for the game [Shapez 2](https://store.steampowered.com/app/2162800/shapez_2/). It provides:

- **Shape Viewer** — 3D visualization of shapes by identifier
- **Blueprint Codec** — Encode/decode/modify blueprint data (gzip + base64 format)
- **Blueprint Viewer** — 3D visualization of game blueprints
- **Blueprint Sharing** — Upload, search, bookmark, and share blueprints

**Stack**: Svelte 5, SvelteKit 2, TypeScript (strict), Three.js/Threlte, Tailwind CSS 4, Zod, PocketBase

**Monorepo**: Bun workspaces with apps in `apps/` and shared packages in `packages/`.

## Monorepo Structure

This project is organized as a Bun workspaces monorepo:

| Path                             | Purpose                                                                    |
| -------------------------------- | -------------------------------------------------------------------------- |
| `apps/shapez-vortex-sveltekit/`  | SvelteKit web application (frontend + API routes)                          |
| `apps/shapez-vortex-pocketbase/` | PocketBase backend (Dockerfile, Caddy proxy, Docker Compose)               |
| `packages/blueprint/`           | Shared package — pure blueprint codec and Zod schemas (`@shapez-vortex/blueprint`) |

## Commands

Use `bun` as the package manager and runtime — not npm, yarn, or pnpm.

All commands are run from the **repository root**. Use `--filter` to target specific workspaces.

```sh
bun install                                              # Install dependencies for all workspaces
bun run --filter shapez-vortex-sveltekit dev             # Start dev server (localhost:5173)
bun run --filter shapez-vortex-sveltekit build           # Production build (requires env vars — see below)
bun run --filter shapez-vortex-sveltekit check           # TypeScript + Svelte type checking
bun run --filter shapez-vortex-sveltekit test            # Run all tests once
bun run --filter shapez-vortex-sveltekit test:coverage   # Run tests with coverage report
bun run --filter shapez-vortex-sveltekit lint            # Check formatting (Prettier) and linting (ESLint)
bun run --filter shapez-vortex-sveltekit format          # Auto-format source code
bun run --filter @shapez-vortex/blueprint test           # Run blueprint package tests
```

Always run `bun run --filter shapez-vortex-sveltekit lint` and `bun run --filter shapez-vortex-sveltekit test` before considering a change complete. The CI pipeline enforces both on all PRs. When modifying `packages/blueprint/`, also run `bun run --filter @shapez-vortex/blueprint test`.

## Environment Variables

Copy `apps/shapez-vortex-sveltekit/.env.example` to `apps/shapez-vortex-sveltekit/.env` and fill in the values before running the dev server or build:

```
POCKETBASE_URL="http://localhost:8080"
ADMIN_EMAIL="email@admin.com"
ADMIN_PASSWORD="password"
```

Never commit `.env` files.

## Architecture

### Directory Structure

| Path                                                      | Purpose                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `apps/shapez-vortex-sveltekit/src/routes/`                | SvelteKit file-based routing (pages + API endpoints)                     |
| `apps/shapez-vortex-sveltekit/src/lib/`                   | Shared library code                                                      |
| `apps/shapez-vortex-sveltekit/src/lib/blueprint.ts`       | Thin shim — re-exports from `@shapez-vortex/blueprint`, adds `BlueprintRecord`/`BlueprintTag` (PocketBase types), wraps `encode`/`isBlueprint`/`update` with injected schema |
| `apps/shapez-vortex-sveltekit/src/lib/blueprint.schema.ts` | Thin shim — re-exports package constants and instantiates schema factories with `GAME_VERSION` and `isShapeIdentifier` |
| `apps/shapez-vortex-sveltekit/src/lib/shape.ts`           | Shape identifier parsing and validation                                  |
| `apps/shapez-vortex-sveltekit/src/lib/server/`            | Server-only code (PocketBase API calls)                                  |
| `apps/shapez-vortex-sveltekit/src/lib/client/`            | Client-only code (Svelte actions, toast service, utilities)              |
| `apps/shapez-vortex-sveltekit/src/lib/components/`        | Svelte UI components organized by feature                                |
| `apps/shapez-vortex-sveltekit/src/lib/components/models/` | Auto-generated 3D model components — do not edit manually                |
| `apps/shapez-vortex-sveltekit/src/lib/schemas/`           | Auto-generated TypeScript types from JSON schemas — do not edit manually |
| `apps/shapez-vortex-sveltekit/src/lib/assets/`            | Static data, JSON schemas, GLSL shaders, images                          |
| `apps/shapez-vortex-sveltekit/static/`                    | Static assets served directly (GLTF models, favicon, robots.txt)         |
| `apps/shapez-vortex-sveltekit/resources/`                 | Asset pipeline scripts                                                   |
| `apps/shapez-vortex-pocketbase/`                          | PocketBase backend (Docker, Caddy, migrations)                           |
| `packages/blueprint/src/index.ts`                        | Package entry point — codec functions (`decode`, `encode`, `update`, `isBlueprint`, `isBlueprintIdentifier`, `getBuildingCount`, etc.) and all identifier constants/types |
| `packages/blueprint/src/schema.ts`                       | Package schemas — static Zod schemas plus factory functions (`makeBlueprintSchema`, `makeBlueprintFormSchema`, etc.) that accept `gameVersion` / `isShapeIdentifier` |
| `docs/`                                                   | Project documentation                                                    |

### Key Patterns

- **PocketBase** is the backend (auth, database, file storage). It is initialized once per request in `src/hooks.server.ts` and exposed via `event.locals`.
- **Zod schemas** are used for runtime validation at all layers: form input, API requests/responses, and domain data. Co-locate schemas with their domain modules (e.g., `blueprint.schema.ts` next to `blueprint.ts`).
- **Forms** use `sveltekit-superforms` with Zod for validation and `formsnap` for components.
- **3D rendering** uses Threlte (declarative Svelte bindings for Three.js). Building models are rendered with custom GLSL shaders in `src/lib/assets/shaders/building/`.
- **Component styling** uses Tailwind CSS utility classes. Use `class-variance-authority` (CVA) for variant-based component APIs.

### Route Structure

- `src/routes/(app)/` — Main application pages (shape viewer, blueprint tools, auth, user settings)
- `src/routes/api/v1/` — REST API endpoints (blueprint, login, user)

## Coding Conventions

### Svelte 5 Runes

This project uses Svelte 5 with the runes API. Do not use legacy reactive syntax.

```svelte
<!-- Correct -->
let count = $state(0);
let doubled = $derived(count * 2);
$effect(() => { console.log(count); });

<!-- Incorrect — legacy syntax -->
let count = 0;
$: doubled = count * 2;
```

### TypeScript

Strict mode is enabled. Avoid `any` — use proper types or `unknown` with narrowing.

A shared `tsconfig.base.json` at the repo root defines common compiler options. Each app extends it (e.g., `apps/shapez-vortex-sveltekit/tsconfig.json` extends both the base config and `.svelte-kit/tsconfig.json`).

### Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add blueprint export to JSON
fix: correct shape layer rendering order
chore: update PocketBase SDK to 0.27
```

### Branch Naming

```
feat/<description>
fix/<description>
chore/<description>
```

### Formatting

- Single quotes
- 2-space indentation
- Run `bun run --filter shapez-vortex-sveltekit format` to auto-apply Prettier formatting

## Testing

Tests are co-located with source files in `apps/shapez-vortex-sveltekit/src/`. There are two Vitest workspaces:

| Workspace | Environment | File Pattern                                |
| --------- | ----------- | ------------------------------------------- |
| `client`  | jsdom       | `src/**/*.svelte.{test,spec}.{js,ts}`       |
| `server`  | node        | `src/**/*.{test,spec}.{js,ts}` (non-Svelte) |

Use `@testing-library/svelte` for component tests. The client setup file (`vitest-setup-client.ts`) provides `@testing-library/jest-dom` matchers and mocks `window.matchMedia`.

The `packages/blueprint/` package has its own Vitest setup. Tests are co-located in `packages/blueprint/src/` and run with `bun run --filter @shapez-vortex/blueprint test`.

## Auto-Generated Files

The following files and directories are generated by tooling. Do not edit them manually — re-run the relevant script instead.

| Path                                                      | Generator                        | Script                                                                                                                   |
| --------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `apps/shapez-vortex-sveltekit/src/lib/components/models/` | `@threlte/gltf` from GLTF models | `bun run --filter shapez-vortex-sveltekit prepare:buildings` / `bun run --filter shapez-vortex-sveltekit prepare:shapes` |
| `apps/shapez-vortex-sveltekit/src/lib/schemas/`           | `json2ts` from JSON schemas      | `bun run --filter shapez-vortex-sveltekit prepare:schemas`                                                               |
