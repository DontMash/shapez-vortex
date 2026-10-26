import type PocketBase from 'pocketbase';
import type { UserFixture } from '$tests/fixtures/user.fixture';

export const createUserRobot = (pb: PocketBase) => ({
  async signUp(fixture: UserFixture) {
    return pb.collection('users').create({
      username: fixture.username,
      displayname: fixture.displayname,
      email: fixture.email,
      password: fixture.password,
      passwordConfirm: fixture.password,
      verified: false,
      blueprints: [],
      bookmarks: [],
    });
  },

  async signIn(fixture: UserFixture) {
    return pb
      .collection('users')
      .authWithPassword(fixture.username, fixture.password);
  },

  async signOut() {
    pb.authStore.clear();
  },
});
