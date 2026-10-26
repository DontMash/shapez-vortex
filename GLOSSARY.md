# Shapez Vortex

Community platform for Shapez 2: blueprint sharing, search, and 3D shape/blueprint viewers backed by PocketBase.

## Testing Language

**Robot**:
A reusable test helper that encapsulates how to interact with the system under test — e.g., signing in a user, uploading a blueprint, searching. Robots hide the mechanics of an interaction so tests read as intent.
_Avoid_: Helper, driver, actor, page object

**Fixture**:
Test data to act on, provided as plain values or factory functions — e.g., a user's credentials, a blueprint's title and shape code. Fixtures are pure data; turning them into database records is a robot's job.
_Avoid_: Scenario, seed, persona, test data

**Fake**:
A stateful, in-memory implementation of a dependency's real behavior — e.g., the fake PocketBase. Tests assert on outcomes, not on which methods were called.
_Avoid_: Mock, stub
