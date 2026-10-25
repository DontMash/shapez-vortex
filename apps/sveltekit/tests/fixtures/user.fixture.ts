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

export const userB: UserFixture = {
  username: 'userb',
  displayname: 'User B',
  email: 'userb@test.com',
  password: 'password123',
};
