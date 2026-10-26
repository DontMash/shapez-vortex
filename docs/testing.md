# Testing

Tests in this project follow a **Robot + Fixture** pattern that separates three concerns: what to verify, how to interact, and what data to act on.

## The three roles

| Role        | Responsibility                                                                 | Location                            |
| ----------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| **Test**    | What to verify — orchestrates robots and fixtures, contains assertions        | Co-located with source in `src/`    |
| **Robot**   | How to interact — factory function, takes a PocketBase client, owns its session | `apps/sveltekit/tests/robots/`      |
| **Fixture** | What data to act on — pure values or factory functions, no setup logic          | `apps/sveltekit/tests/fixtures/`    |

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

Tests get their PocketBase client from `createTestPocketBase()` (`tests/test-pocketbase.ts`) — never from `createFakePocketBase()` directly. By default it returns an in-memory fake PocketBase (`tests/fakes/pocketbase.fake.ts`). Set `PB_TEST_URL` to run the same tests against a real PocketBase:

```sh
pnpm dev:db                                 # PocketBase on :8080
PB_TEST_URL=http://localhost:8080 pnpm test # same tests, real backend
```

Note: the real backend requires verified users for blueprint creation (`blueprints.createRule`), and tests share one database — until the integration layer adds a verify step and per-test isolation, the suite runs green in fake mode only (see `docs/adr/0002-test-backends.md`).

Robots, fixtures, and assertions don't change between backends — the client is injected into the robots. `createClient()` works the same in both modes: a new client with its own auth state, sharing the same data. Use it for multi-user tests:

```ts
const pbA = createTestPocketBase();
const pbB = pbA.createClient();
const robotA = createUserRobot(pbA);
const robotB = createUserRobot(pbB);
```

The fake enforces no access rules and does not model `verified`. Authz lives in the PocketBase JSVM hook (`apps/pocketbase/pb_hooks/blueprints.pb.js`), the single source of authz — test access rules and verified-user flows against the real backend only.

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
- **Test discovery**: Vitest discovers `src/**/*.{test,spec}.{js,ts}` — test files must live in `src/`
- **Terminology**: Use "Robot", "Fixture", and "Fake" (see `GLOSSARY.md`). Avoid "scenario", "helper", "driver", "seed", "persona", "mock"
- **Backend**: Get the client from `createTestPocketBase()`, never `createFakePocketBase()` directly — set `PB_TEST_URL` to run the same test against a real PocketBase
- **Casting**: Never cast the fake to `PocketBase` in tests — `createFakePocketBase()` already returns a PocketBase-compatible type
- **Access rules**: The fake enforces no access rules — test authz against the real backend only (the JSVM hook is the single source of authz)
- **Robot growth**: Add robot actions per-feature as tests arrive — a robot without a test is speculative surface
- **Fixtures**: Prefer factory functions with overrides (`createUserFixture({ ... })`) over new named constants when a test needs several records of the same kind
- **Multi-user tests**: Call `createClient()` on the test client for each actor — each client has its own auth session but shares the same data. Pass a separate client to each robot.

## What makes a good test

Tests verify external behavior, not implementation details. A test should read as a specification of intent: "user signs in, uploads a blueprint, and finds it via search." Don't test private methods or mock internal collaborators — test at the seam (the public interface of the module under test).
