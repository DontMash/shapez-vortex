import type { RecordModel } from 'pocketbase';
import { z } from 'zod';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 24;
const USERNAME_REGEX = new RegExp(`^[A-Za-z0-9_]*$`);
const USERNAME_SCHEMA = z
  .string()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH)
  .regex(USERNAME_REGEX);
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_SCHEMA = z.string().min(PASSWORD_MIN_LENGTH);

export const USER_REGISTER_FORM_SCHEMA = z.object({
  username: USERNAME_SCHEMA,
  displayname: USERNAME_SCHEMA,
  email: z.string().email(),
  password: PASSWORD_SCHEMA,
});
export const USER_LOGIN_FORM_SCHEMA = z.object({
  username: USERNAME_SCHEMA,
  password: PASSWORD_SCHEMA,
  redirect: z.string().optional(),
});

export const USER_FORM_ERROR_MESSAGES: Record<string, string> = {
  username: 'Username unavailable',
  email: 'Email unavailable',
};

export interface User extends RecordModel {
  username: string;
  displayname: string;
  email: string;
  verified: boolean;
  blueprints: Array<string>;
  bookmarks: Array<string>;
}
