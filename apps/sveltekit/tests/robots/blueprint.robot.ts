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
