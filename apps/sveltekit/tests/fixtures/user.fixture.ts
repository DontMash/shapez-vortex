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

export const userB: UserFixture = createUserFixture({
  username: 'userb',
  displayname: 'User B',
  email: 'userb@test.com',
});
