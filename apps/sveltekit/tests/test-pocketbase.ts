import PocketBase from 'pocketbase';
import {
  createFakePocketBase,
  type FakePocketBase,
} from '$tests/fakes/pocketbase.fake';

export const createTestPocketBase = (): FakePocketBase => {
  const url = process.env.PB_TEST_URL;
  if (!url) {
    return createFakePocketBase();
  }
  return Object.assign(new PocketBase(url), {
    createClient: createTestPocketBase,
  });
};
