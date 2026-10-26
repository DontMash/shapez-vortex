import { describe, it, expect } from 'vitest';
import { createTestPocketBase } from '$tests/test-pocketbase';
import { createUserRobot } from '$tests/robots/user.robot';
import { createBlueprintRobot } from '$tests/robots/blueprint.robot';
import { userA, userB } from '$tests/fixtures/user.fixture';
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

  it('shares an uploaded blueprint with another signed-in user', async () => {
    const pbA = createTestPocketBase();
    const pbB = pbA.createClient();

    const userRobotA = createUserRobot(pbA);
    const userRobotB = createUserRobot(pbB);
    await userRobotA.signUp(userA);
    await userRobotA.signIn(userA);
    await userRobotB.signUp(userB);
    await userRobotB.signIn(userB);

    const blueprintRobotA = createBlueprintRobot(pbA);
    const uploaded = await blueprintRobotA.upload(blueprintFixture);

    const blueprintRobotB = createBlueprintRobot(pbB);
    const results = await blueprintRobotB.search(blueprintFixture.title);
    expect(results.items).toHaveLength(1);
    expect(results.items.map((item) => item.id)).toContain(uploaded.id);
  });
});
