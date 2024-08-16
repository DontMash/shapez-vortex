import type { RecordModel } from 'pocketbase';
import { z } from 'zod';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;
export const USERNAME_REGEX = new RegExp(`^[A-Za-z0-9_]{${USERNAME_MIN_LENGTH},${USERNAME_MAX_LENGTH}}$`);
export const PASSWORD_MIN_LENGTH = 8;
export const USER_REGISTER_FORM_SCHEMA = z.object({
    username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).regex(USERNAME_REGEX),
    displayname: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).regex(USERNAME_REGEX),
    email: z.string().email(),
    password: z.string().min(8),
});
export const USER_LOGIN_FORM_SCHEMA = z.object({
    username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH).regex(USERNAME_REGEX),
    password: z.string().min(8),
    redirect: z.string().optional(),
});

export const USER_FORM_ERROR_MESSAGES: Record<string, string> = {
    username: 'Username unavailable',
    email: 'Email unavailable'
};

export interface User extends RecordModel {
    username: string;
    displayname: string;
    email: string;
    verified: boolean;
    blueprints: Array<string>;
    bookmarks: Array<string>;
};
