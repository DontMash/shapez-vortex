# Agents

This file provides instructions for AI coding agents working on the shapez-vortex codebase.

## Project Overview

Shapez Vortex is a community web platform for the game [Shapez 2](https://store.steampowered.com/app/2162800/shapez_2/). It provides:

- **Shape Viewer** — 3D visualization of shapes by identifier
- **Blueprint Codec** — Encode/decode/modify blueprint data (gzip + base64 format)
- **Blueprint Viewer** — 3D visualization of game blueprints
- **Blueprint Sharing** — Upload, search, bookmark, and share blueprints

**Stack**: Svelte 5, SvelteKit 2, TypeScript (strict), Three.js/Threlte, Tailwind CSS 4, Zod, PocketBase

## Commands

Use `bun` as the package manager and runtime — not npm, yarn, or pnpm.

```sh
bun install                # Install dependencies
bun run dev                # Start dev server (localhost:5173)
bun run build              # Production build (requires env vars — see below)
bun run check              # TypeScript + Svelte type checking
bun run test               # Run all tests once
bun run test:coverage      # Run tests with coverage report
bun run lint               # Check formatting (Prettier) and linting (ESLint)
bun run format             # Auto-format source code
```

Always run `bun run lint` and `bun run test` before considering a change complete. The CI pipeline enforces both on all PRs.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values before running the dev server or build:

```
POCKETBASE_URL="http://localhost:8080"
ADMIN_EMAIL="email@admin.com"
ADMIN_PASSWORD="password"
```

Never commit `.env` files.

## Architecture

### Directory Structure

| Path                         | Purpose                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| `src/routes/`                | SvelteKit file-based routing (pages + API endpoints)                     |
| `src/lib/`                   | Shared library code                                                      |
| `src/lib/blueprint.ts`       | Blueprint encode/decode logic                                            |
| `src/lib/shape.ts`           | Shape identifier parsing and validation                                  |
| `src/lib/server/`            | Server-only code (PocketBase API calls)                                  |
| `src/lib/client/`            | Client-only code (Svelte actions, toast service, utilities)              |
| `src/lib/components/`        | Svelte UI components organized by feature                                |
| `src/lib/components/models/` | Auto-generated 3D model components — do not edit manually                |
| `src/lib/schemas/`           | Auto-generated TypeScript types from JSON schemas — do not edit manually |
| `src/lib/assets/`            | Static data, JSON schemas, GLSL shaders, images                          |
| `static/`                    | Static assets served directly (GLTF models, favicon, robots.txt)         |
| `resources/`                 | Deployment configs and asset pipeline scripts                            |
| `docs/`                      | Project documentation                                                    |

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
- Run `bun run format` to auto-apply Prettier formatting

## Testing

Tests are co-located with source files. There are two Vitest workspaces:

| Workspace | Environment | File Pattern                                |
| --------- | ----------- | ------------------------------------------- |
| `client`  | jsdom       | `src/**/*.svelte.{test,spec}.{js,ts}`       |
| `server`  | node        | `src/**/*.{test,spec}.{js,ts}` (non-Svelte) |

Use `@testing-library/svelte` for component tests. The client setup file (`vitest-setup-client.ts`) provides `@testing-library/jest-dom` matchers and mocks `window.matchMedia`.

## Auto-Generated Files

The following files and directories are generated by tooling. Do not edit them manually — re-run the relevant script instead.

| Path                         | Generator                        | Script                                                 |
| ---------------------------- | -------------------------------- | ------------------------------------------------------ |
| `src/lib/components/models/` | `@threlte/gltf` from GLTF models | `bun run prepare:buildings` / `bun run prepare:shapes` |
| `src/lib/schemas/`           | `json2ts` from JSON schemas      | `bun run prepare:schemas`                              |
