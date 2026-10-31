# Unit testing and coverage

Stage 0 of #177 (#178) establishes measurement only. No business source group is complete. The arithmetic smoke test remains; tooling tests exercise only coverage reporting/policy with independent synthetic counts.

## Commands

Use Node >=22 and pnpm 11.5.3, with dependencies installed using `pnpm install --frozen-lockfile`.

- `pnpm test`: unit tests, no coverage gate.
- `pnpm test:coverage`: clean output, run Vitest/V8, apply coverage policy, validate source membership, and render Markdown. This is also CI's test command.
- Verification order: `pnpm lint`, `pnpm check`, `pnpm format`, `pnpm test`, `pnpm build`, then `pnpm test:coverage` for coverage acceptance. An inert `POCKETBASE_URL=http://127.0.0.1:8080` supplies build configuration; no live PocketBase is needed.

Tests must not require Docker, network access, a database, real browser, or WebGL. Client tests run in happy-dom; tooling and tests in `src/**/server/`, `*.server.test/spec.*`, and PocketBase hook test locations run in Node. Name request-handler/hook tests accordingly. Client project ordering is intentional: Vitest 4's uncovered-file transformer chooses the first matching project. Its happy-dom environment selects Svelte client compilation, retaining callbacks and attachments that server compilation can erase. Do not reorder projects or change to SSR-only coverage without verifying client callback source mapping. The DOM emulator is needed now for accurate client measurement, not evidence of rendering correctness.

## Source denominator

`apps/sveltekit/tooling/testing/scope.mjs` is shared by Vitest and the report's inventory validation. Positive scope is all SvelteKit `src/**/*.{js,ts,svelte}` plus the absolute sibling PocketBase `pb_hooks/*.js` glob (`allowExternal` enabled). Unimported files count as uncovered, without evaluating their application imports. Coverage maps back to handwritten source, not a second compiled-code inventory.

Explicit exclusions:

- `.d.ts` declarations; currently `src/app.d.ts` is the only true type-only source.
- Test/spec files and `__tests__`, `__fixtures__`, `test-support` directories.
- Generated model `buildings/` and `shapes/` trees and generated `models/Error.svelte`.
- `src/lib/style/typography.js`, a Tailwind tooling plugin rather than application behavior.

The positive scope excludes dependencies, assets/GLSL/JSON, static files, tooling/configuration, migrations, and generated/build output. Tooling itself is outside application coverage but has focused tests, ESLint, formatting, and a separate JavaScript type check. Do not use Prettier/ESLint ignores as coverage rules. All four runtime-bearing `*.types.ts` modules remain included. Handwritten viewers and the building registry remain included even when they import generated models.

The reporter checks every eligible filename against the machine summary. A silently dropped transform is unavailable coverage and fails the command, not permission to exclude difficult source. Do not use partial/changed/project-filtered coverage runs as the authoritative baseline.

## Reports and initial baseline

Output is git-ignored at `apps/sveltekit/coverage/`:

- `summary.md`: Markdown with four metrics and covered/total counts.
- `coverage-summary.json`: total and per-file counts.
- `coverage-final.json`: source-mapped detailed measurement for inventory/transform inspection.
- `index.html` and accompanying assets: detailed HTML report.

Initial full baseline with Vitest/V8 4.1.11 (Node 26.8.1): **98 eligible files: 97 SvelteKit sources and one PocketBase hook**. All are untested application source; the smoke and tooling tests intentionally do not improve application coverage.

| Metric     | Covered/total | Coverage |
| ---------- | ------------- | -------- |
| Lines      | 0/2808        | 0.00%    |
| Statements | 0/3805        | 0.00%    |
| Functions  | 0/1221        | 0.00%    |
| Branches   | 0/1054        | 0.00%    |

Inventory includes `blueprint.ts`, `blueprint.types.ts`, `CopyButton.svelte`, server/request handlers, and `apps/pocketbase/pb_hooks/blueprints.pb.js`. Generated models, declarations, tests, and typography tooling are absent. Client mapping was checked against CopyButton's `onclick`, `oncopy`, and `onerror` callbacks and clipboard attachment. These are V8/source-map metrics, not proof that every Svelte compiler lowering corresponds one-to-one to a handwritten branch. Inspect source maps when upgrading the compiler/provider.

## Completed groups and durable gates

`tooling/testing/policy.mjs` owns the explicit policy. Stage 0 sets `completedGroups: []` and `globalGate: false`. The low global baseline is reported but non-blocking; missing/invalid coverage is still a failure.

After approval of a behavior segment, define its complete owned source-file list, observable behavior, independent fixtures, external collaborators, and completion checks before writing tests. Add `{ name, files: ['src/...', ...] }` only when the whole group meets **80.01% on each of lines, statements, functions, and branches**. Paths are exact, relative to the SvelteKit root (sibling hook paths use `../pocketbase/...`). No ownership globs: an explicit finite list prevents accidentally claiming future files. Empty, duplicate, or missing ownership is unavailable, not a vacuous pass. A single-file group must genuinely own that module, not select a convenient fragment.

The policy converts each finite file list into a Vitest aggregate threshold pattern. Vitest is the sole percentage-gate authority, with `perFile: false`; each group remains independently gated and its files remain in the global denominator. Reporting sums covered/total counts, never averages file percentages, and uses Istanbul's two-decimal truncation. Exactly 80.00% fails. Do not use auto-update thresholds or subtract completed groups globally.

Once all four global metrics reach the target, set `globalGate: true` in a reviewed commit. This durable switch enables the same built-in global thresholds and must not be conditionally disabled on regression. A high baseline alone never toggles it. Group gates remain enabled thereafter.

## CI and failure behavior

Only the test job changes. Existing build dependency and release ordering remain intact. Reporting uses read-only job permissions, native Actions run summaries, and `actions/upload-artifact`; no external service, PR comment, or elevated trigger.

The wrapper deletes coverage before even loading Vitest configuration, preserves the original failing runner exit, and requests coverage after test failure. Missing/malformed summaries or missing eligible source are explicitly unavailable and nonzero. CI also cleans before installation. Summary publication runs with `always()`; a missing wrapper report produces an explicit unavailable message. The downloadable `coverage-html` artifact is published after failures only when this run produced valid coverage and HTML (a fresh `report-ready` marker). It includes machine summaries too; it is not a hosted website. Publication never turns the failed test/gate step green. Very early failures/cancellation may prevent report generation or artifact upload.

## Roadmap and test standards

Stop after Stage 0 for maintainer review. Stage 1, only after explicit approval, covers blueprint codec/normalization/version updates/counts/cost through existing public interfaces with real compression/schema code and independent expected fixtures. Remove the smoke test only when meaningful behavior tests replace it.

Subsequent separately approved groups may cover PocketBase authorization, shapes and generation, server/auth/request behavior, search/pagination, utilities/timers, client state/actions, and components/viewers. Test public outputs, errors, state transitions, and DOM interactions rather than private helpers or call counts. Control and restore clocks, randomness, subscriptions, mocks, and module state. Fake only genuine external boundaries. Suspected bugs or larger restructuring require a decision, not silent characterization or product changes.

DOM emulation/fake WebGL capabilities do not validate rendering, and fake PocketBase records do not establish JSVM compatibility. Real-browser, cross-service, and visual coverage belong to a future Playwright/integration initiative, not this unit-testing rollout.
