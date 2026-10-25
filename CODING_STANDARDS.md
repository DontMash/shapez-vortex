# Coding Standards

Conventions for writing code in this repository. For agent-specific instructions (toolchain, setup, verify commands, architecture), see `AGENTS.md`.

## Language & Framework

- Svelte 5 runes only (`$props`, `$state`, `$derived`); no Svelte 4 syntax.
- No source comments unless asked (matches existing code).
- Tailwind 4: theme tokens (`--color-*`, `--radius-*`, `--text-*`, `--leading-*`, `--font-*`) live in `apps/sveltekit/src/app.css` under `@theme`; new colors go there.
- `csrf: { trustedOrigins: ['*'] }` is intentional for the OAuth-style sign-in flow; do not tighten it without a replacement strategy.

## Commits

- Conventional Commits are required — `changelogen` reads them and bumps `package.json` + writes `CHANGELOG.md`.

## Testing

See [docs/testing.md](docs/testing.md) for the test pattern (Robot + Fixture), directory structure, and conventions.
