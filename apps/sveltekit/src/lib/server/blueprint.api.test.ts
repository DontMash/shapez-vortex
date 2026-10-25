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
