import { describe, expect, it } from 'vitest';
import {
  PASSWORD_RESET_FORM_SCHEMA,
  USER_LOGIN_FORM_SCHEMA,
  USER_REGISTER_FORM_SCHEMA,
} from './user.schema';

describe('register', () => {
  it('success', () => {
    const data = {
      username: 'tester',
      displayname: 'Tester',
      email: 'test@test.com',
      password: 'testtest',
    };
    const result = USER_REGISTER_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.username.length).toBeGreaterThan(3);
    expect(result.data?.username.length).toBeLessThan(24);
    expect(result.data?.username).toMatch(new RegExp(`^[A-Za-z0-9_]*$`));
    expect(result.data?.displayname.length).toBeGreaterThan(3);
    expect(result.data?.displayname.length).toBeLessThan(24);
    expect(result.data?.displayname).toMatch(new RegExp(`^[A-Za-z0-9_]*$`));
    expect(result.data?.email).toBeDefined();
    expect(result.data?.password.length).toBeGreaterThanOrEqual(8);
  });

  it('failure', () => {
    const data = {};
    const result = USER_REGISTER_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.data).toBe(undefined);
  });

  it('failure - invalid email', () => {
    const data = {
      username: 'tester',
      displayname: 'Tester',
      email: 'test@test',
      password: 'testtest',
    };
    const result = USER_REGISTER_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.data).toBe(undefined);
  });
});

describe('login', () => {
  it('success', () => {
    const data = {
      username: 'tester',
      password: 'testtest',
    };
    const result = USER_LOGIN_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.username.length).toBeGreaterThan(3);
    expect(result.data?.username.length).toBeLessThan(24);
    expect(result.data?.username).toMatch(new RegExp(`^[A-Za-z0-9_]*$`));
    expect(result.data?.password.length).toBeGreaterThanOrEqual(8);
  });

  it('success - optional redirect', () => {
    const data = {
      username: 'tester',
      password: 'testtest',
      redirect: '/settings/profile',
    };
    const result = USER_LOGIN_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.redirect).toBeDefined();
  });

  it('failure', () => {
    const data = {};
    const result = USER_LOGIN_FORM_SCHEMA.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.data).toBe(undefined);
  });
});

describe('password reset', () => {
  it('success', () => {
    const data = {
      email: 'test@test.com',
    };
    const result = PASSWORD_RESET_FORM_SCHEMA.safeParse(data);

    expect(result.success).toBe(true);
    expect(result.error).toBe(undefined);
    expect(result.data?.email).toBeDefined();
  });

  it('failure', () => {
    const data = {};
    const result = PASSWORD_RESET_FORM_SCHEMA.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.data).toBe(undefined);
  });

  it('failure - invalid email', () => {
    const data = {
      email: 'test@test',
    };
    const result = PASSWORD_RESET_FORM_SCHEMA.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.data).toBe(undefined);
  });
});
