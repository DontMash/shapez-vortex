# Testing

## Run tests

Use the repository's Node and pnpm versions and install dependencies with `pnpm install --frozen-lockfile`.

From the repository root:

```sh
pnpm test
pnpm test:coverage
```

These commands run the corresponding scripts across workspace projects that define them. Each app/package owns its test configuration, dependencies, and coverage; one suite does not collect another service's source. All suites run even if one fails, and any failure fails the root command.

To work on the SvelteKit suite directly:

```sh
pnpm --filter @shapez-vortex/sveltekit exec vitest
pnpm --filter @shapez-vortex/sveltekit exec vitest run src/path/example.test.ts
```

The first command watches for changes; replace the example path in the second command with the test file you want to run. Filtered runs are useful while developing, but use the full coverage command for coverage acceptance.

## Write tests

Include tests with new or changed behavior in the same PR. Bug fixes should include a regression test. Review the tested behavior and assertions rather than treating a coverage percentage as proof of correctness.

Keep tests with the app/package they exercise. SvelteKit discovers `*.test.{js,ts}` and `*.spec.{js,ts}` under `src/`. Its client tests use happy-dom; tests under a `server/` directory and files named `*.server.test/spec.*` or `+server.test/spec.*` use Node.

Test observable outputs, errors, state transitions, and DOM interactions through existing public interfaces. Use independent expected fixtures rather than deriving expectations with the implementation under test. Fake genuine external boundaries rather than internal collaborators, and restore test doubles, clocks, randomness, subscriptions, and module state between tests.

Unit tests must run without Docker, network access, a database, a real browser, or WebGL. A DOM emulator does not establish rendering correctness, and a fake service boundary does not establish compatibility with the real service. Those require separate integration or browser testing. Pure-data modules use direct unit tests without robots.

## The three roles

Server-side tests follow a **Robot + Fixture** pattern that separates what to verify, how to interact, and what data to act on.

| Role        | Responsibility                                                                  | Location                         |
| ----------- | ------------------------------------------------------------------------------- | -------------------------------- |
| **Test**    | What to verify — orchestrates robots and fixtures, contains assertions          | Co-located with source in `src/` |
| **Robot**   | How to interact — factory function, takes a PocketBase client, owns its session | `apps/sveltekit/tests/robots/`   |
| **Fixture** | What data to act on — pure values or factory functions, no setup logic          | `apps/sveltekit/tests/fixtures/` |

### Test

A test file (`*.test.ts`) states what behavior to verify. It creates robots, feeds them fixtures, and asserts on the results. Tests live co-located with the code they test.

```ts
// src/lib/server/blueprint.api.test.ts
import { describe, it, expect } from 'vitest';
import { createTestPocketBase } from '$tests/test-pocketbase';
import { createUserRobot } from '$tests/robots/user.robot';
import { createBlueprintRobot } from '$tests/robots/blueprint.robot';
import { userA } from '$tests/fixtures/user.fixture';
import { blueprintFixture } from '$tests/fixtures/blueprint.fixture';

describe('blueprint flow', () => {
  it('signs up, signs in, uploads a blueprint, and finds it via search', async () => {
    const pb = createTestPocketBase();
    const userRobot = createUserRobot(pb);
    const blueprintRobot = createBlueprintRobot(pb);

    await userRobot.signUp(userA);
    await userRobot.signIn(userA);

    const uploaded = await blueprintRobot.upload(blueprintFixture);
    expect(uploaded.title).toBe(blueprintFixture.title);

    const results = await blueprintRobot.search(blueprintFixture.title);
    expect(results.items).toHaveLength(1);
    expect(results.items.map((item) => item.id)).toContain(uploaded.id);
  });
});
```

### Robot

A robot is a factory function that takes a PocketBase client and returns an object with domain actions. Robots own their auth session — call `signIn` to authenticate.

Robots are organized per-domain:

- `UserRobot` — `signUp`, `signIn`, `signOut`
- `BlueprintRobot` — `upload`, `search`, `update`

```ts
// tests/robots/blueprint.robot.ts
import type PocketBase from 'pocketbase';
import { get, post, put } from '$lib/server/blueprint.api';
import type { BlueprintFixture } from '$tests/fixtures/blueprint.fixture';

export const createBlueprintRobot = (pb: PocketBase) => ({
  async upload(fixture: BlueprintFixture) {
    return post(pb, fixture);
  },

  async search(query: string) {
    return get(pb, { query });
  },

  async update(id: string, fixture: BlueprintFixture) {
    return put(pb, id, fixture);
  },
});
```

### Fixture

A fixture is pure data — a plain object or a factory function that returns one. Fixtures contain no setup logic; turning a fixture into a database record is a robot's job. When a test needs several records of the same kind (e.g., multiple users), prefer a factory with overrides over new named constants.

```ts
// tests/fixtures/user.fixture.ts
export type UserFixture = {
  username: string;
  displayname: string;
  email: string;
  password: string;
};

export const createUserFixture = (
  overrides: Partial<UserFixture> = {},
): UserFixture => ({
  username: 'user',
  displayname: 'User',
  email: 'user@test.com',
  password: 'password123',
  ...overrides,
});

export const userA: UserFixture = createUserFixture({
  username: 'usera',
  displayname: 'User A',
  email: 'usera@test.com',
});
```

## Test backends

Tests get their PocketBase client from `createTestPocketBase()` (`tests/test-pocketbase.ts`) — never from `createFakePocketBase()` directly. By default it returns an in-memory fake PocketBase (`tests/fakes/pocketbase.fake.ts`). To select a real PocketBase, set `POCKETBASE_URL` in the shell/CI environment or create `apps/sveltekit/.env.test` containing:

```sh
POCKETBASE_URL=http://localhost:8080
```

Vite's test configuration parses only `.env.test` using Node's native `util.parseEnv()` and passes the result to Vitest without preloading `process.env`. Shell/CI values override file values, including an empty `POCKETBASE_URL` to select the fake. A missing file supplies no overrides, so tests use the fake unless the shell/CI environment selects a real backend.

Shared `.env` and `.env.local` files do not select the test backend. SvelteKit's normal env loading is unchanged: application code importing `$env/...` can still read shared files. This isolates backend selection, not every environment value accessible to tests. `.env.development` remains optional for development-only application configuration.

Then run the suite as usual:

```sh
pnpm dev:db   # PocketBase on :8080
pnpm test     # same tests, real backend
```

Note: the real backend requires verified users for blueprint creation (`blueprints.createRule`), and tests share one database — until the integration layer adds a verify step and per-test isolation, the suite runs green in fake mode only (see `docs/adr/0002-test-backends.md`).

Robots, fixtures, and assertions don't change between backends — the client is injected into the robots. `createClient()` works the same in both modes: a new client with its own auth state, sharing the same data. Use it for multi-user tests:

```ts
const pbA = createTestPocketBase();
const pbB = pbA.createClient();
const robotA = createUserRobot(pbA);
const robotB = createUserRobot(pbB);
```

The fake enforces no access rules and does not model `verified`. Authz lives in the PocketBase JSVM hook (`apps/pocketbase/pb_hooks/blueprints.pb.js`), the single source of authz — test access rules and verified-user flows against the real backend only. PocketBase service source is outside the SvelteKit unit coverage denominator.

## Fake PocketBase

`createFakePocketBase()` returns a `FakePocketBase`: the real `PocketBase` SDK type plus `createClient()`. The fake implements only the PB surface the app uses, so the single cast to the SDK type lives inside the factory — tests and robots never cast.

The fake supports the PB API surface used by `blueprint.api.ts`:

- `collection(name).create(data | FormData)` — coerces numeric strings to numbers
- `collection(name).getList(page, perPage, { filter, sort })` — filter supports `&&` (AND) and `||` (OR)
- `collection(name).getFullList({ filter })`
- `collection(name).getOne(id)`
- `collection(name).update(id, data)` — with `field+` array-append and `field-` array-remove syntax
- `collection(name).authWithPassword(identity, password)` — matches the identity against `username` (the users collection's identity field)
- `authStore` — `isValid`, `model`, `record`, `clear()`, `save()`, `loadFromCookie()`, `exportToCookie()`
- `createClient()` — a new client with its own auth state, sharing the same data (see Test backends for multi-user tests)

## Conventions

- **File naming**: `*.robot.ts`, `*.fixture.ts`, `*.fake.ts` (dot-suffixed, matching project convention)
- **Imports**: Use the `$tests` alias for test infrastructure (`$tests/robots/...`, `$tests/fixtures/...`, `$tests/fakes/...`, `$tests/test-pocketbase`)
- **Terminology**: Use "Robot", "Fixture", and "Fake" (see `GLOSSARY.md`). Avoid "scenario", "helper", "driver", "seed", "persona", "mock"
- **Casting**: Never cast the fake to `PocketBase` in tests — `createFakePocketBase()` already returns a PocketBase-compatible type
- **Robot growth**: Add robot actions per-feature as tests arrive — a robot without a test is speculative surface
- **Multi-user tests**: Call `createClient()` on the test client for each actor — each client has its own auth session but shares the same data. Pass a separate client to each robot.

## Read coverage

Vitest/V8 produces the terminal coverage table and HTML/JSON reports in each suite's `coverage/` directory. Open `coverage/index.html` for file-level detail. Report directories are git-ignored and cleaned by the runner before coverage collection.

Suite configuration is the source of truth for eligible source and exclusions. Include untested handwritten executable source, not just modules imported by tests. Exclude generated output, declarations, tests, fixtures, assets, and tooling rather than hiding difficult application code.

For incremental adoption, completed source groups must meet **at least 80% independently for lines, statements, functions, and branches**. Use native aggregate group thresholds, not per-file thresholds, and retain those files in the suite-wide denominator. Once the whole suite meets all four targets, enable its global gate in a reviewed change and retain it on subsequent runs. Existing gates must not be disabled to accommodate regressions.

Coverage is a diagnostic, not a completeness guarantee: transformations and source mapping can omit or distort executable code. Review coverage alongside the feature's tests, especially after compiler or coverage-provider upgrades.

## CI and verification

CI runs workspace suites with coverage, uses Vitest's native GitHub Actions test summaries, and uploads generated coverage directories as the `coverage-html` artifact. Coverage percentages appear in the test logs and HTML report; the test summary is not a coverage table. The test job explicitly sets `POCKETBASE_URL` to an empty string to select the fake backend.

Test or threshold failures remain failures even when reports are uploaded. Vitest can produce coverage after ordinary test failures, but early failures or cancellation may leave no report. Missing output is unavailable coverage, not a zero-percent measurement or evidence of a passing gate.

Before submitting a change, run:

```sh
pnpm lint
pnpm check
pnpm format
POCKETBASE_URL= pnpm test
POCKETBASE_URL=http://127.0.0.1:8080 pnpm build
POCKETBASE_URL= pnpm test:coverage
```

The build needs `POCKETBASE_URL` configured; an inert URL such as `http://127.0.0.1:8080` is sufficient. Keep that setting scoped to the build command: a non-empty shell/CI `POCKETBASE_URL` selects a real backend for tests. The empty values above force fake mode even when `.env.test` selects a real backend.
