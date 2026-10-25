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
import type PocketBase from 'pocketbase';
import { createFakePocketBase } from '$tests/fakes/pocketbase.fake';
import { createUserRobot } from '$tests/robots/user.robot';
import { createBlueprintRobot } from '$tests/robots/blueprint.robot';
import { userA } from '$tests/fixtures/user.fixture';
import { blueprintFixture } from '$tests/fixtures/blueprint.fixture';

describe('blueprint flow', () => {
  it('signs up, signs in, uploads a blueprint, and finds it via search', async () => {
    const pb = createFakePocketBase() as unknown as PocketBase;
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

A fixture is pure data — a plain object or a factory function that returns one. Fixtures contain no setup logic; turning a fixture into a database record is a robot's job.

```ts
// tests/fixtures/user.fixture.ts
export type UserFixture = {
  username: string;
  displayname: string;
  email: string;
  password: string;
};

export const userA: UserFixture = {
  username: 'usera',
  displayname: 'User A',
  email: 'usera@test.com',
  password: 'password123',
};
```

## Fake PocketBase

Tests use an in-memory fake PocketBase (`tests/fakes/pocketbase.fake.ts`) instead of a real database. The fake is injected into robots via dependency injection — the robot factory takes a PB client, and the test passes the fake.

```ts
const pb = createFakePocketBase() as unknown as PocketBase;
const robot = createBlueprintRobot(pb);
```

When real integration tests arrive (Docker-based), the same robots work with a real `PocketBase` client — no robot code changes needed.

The fake supports the PB API surface used by `blueprint.api.ts`:

- `collection(name).create(data | FormData)` — coerces numeric strings to numbers
- `collection(name).getList(page, perPage, { filter, sort })` — filter supports `&&` (AND) and `||` (OR)
- `collection(name).getFullList({ filter })`
- `collection(name).getOne(id)`
- `collection(name).update(id, data)` — with `field+` array-append and `field-` array-remove syntax
- `collection(name).authWithPassword(email, password)`
- `authStore` — `isValid`, `model`, `record`, `clear()`, `save()`, `loadFromCookie()`, `exportToCookie()`
- `createClient()` — returns a new client with its own auth state, sharing the same data. Use for multi-user tests:

```ts
const fake = createFakePocketBase();
const pbA = fake as unknown as PocketBase;
const pbB = fake.createClient() as unknown as PocketBase;
const robotA = createUserRobot(pbA);
const robotB = createUserRobot(pbB);
```

## Conventions

- **File naming**: `*.robot.ts`, `*.fixture.ts`, `*.fake.ts` (dot-suffixed, matching project convention)
- **Imports**: Use the `$tests` alias for test infrastructure (`$tests/robots/...`, `$tests/fixtures/...`, `$tests/fakes/...`)
- **Test discovery**: Vitest discovers `src/**/*.{test,spec}.{js,ts}` — test files must live in `src/`
- **Terminology**: Use "Robot" and "Fixture" (see `GLOSSARY.md`). Avoid "scenario", "helper", "driver", "seed", "persona"
- **Multi-user tests**: Call `createClient()` on the fake for each actor — each client has its own auth session but shares the same data. Pass a separate client to each robot.

## What makes a good test

Tests verify external behavior, not implementation details. A test should read as a specification of intent: "user signs in, uploads a blueprint, and finds it via search." Don't test private methods or mock internal collaborators — test at the seam (the public interface of the module under test).
