# Run robot tests against a fake PocketBase by default and a real PocketBase via `.env.test`

**Status**: accepted

Server-side tests inject a PocketBase client into robots, so the client is the seam between test and backend. `createTestPocketBase()` (`apps/sveltekit/tests/test-pocketbase.ts`) returns an in-memory fake PocketBase by default and a real PocketBase client when the shell/CI environment or `.env.test` sets a non-empty `POCKETBASE_URL` (shell/CI values take precedence), so the same robot tests run against both backends. We chose this over module mocks (which verify interactions, not behavior) and over Docker-only tests (slow, external service in every run): the fake keeps the suite fast and offline, and the real-backend run catches fidelity drift in the fake.

## Considered Options

- **Module mocks (`vi.mock`, `vi.fn`)**: rejected — they record interactions and return canned data, so they verify that the code called PocketBase, not that the business logic (validation, tag creation, relation linking, filtering) works.
- **Real PocketBase only (Docker/testcontainers)**: rejected as the default — every test run would boot a database service, slowing CI and local iteration; kept as the second backend instead.
- **Hand-rolled fake only**: rejected as the only backend — the fake implements just the PB surface the app uses and enforces no access rules, so it can drift from real PocketBase behavior.

## Consequences

- The fake stays rule-free and does not model `verified`; access-rule and verified-user flows are tested against the real backend only (authz lives in the PocketBase JSVM hook, the single source of authz).
- When `blueprint.api.ts` starts using a PB method or filter the fake doesn't implement, fake-mode tests fail loudly (the fake throws on unsupported filter conditions), which is the intended drift signal.
- CI can run the suite twice (fake + real) once the Docker-based integration layer lands; until then only the fake mode runs. Verified against a real PocketBase (v0.40.6, current migrations): the suite passes sign-up and sign-in but stops at blueprint creation — `blueprints.createRule` requires a verified user, and all tests share one database. The integration layer therefore needs (a) a verify step, e.g. a superuser client flipping `verified` via `PB_TEST_SUPERUSER_*` env vars, and (b) per-test isolation (unique fixtures or a database reset between tests).
