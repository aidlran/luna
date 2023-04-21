import type { UserErrorCode } from '../types/user-error-code.type';

export const USER_ERROR_MESSAGES: Record<UserErrorCode, string> = {
  INCORRECT_PASSPHRASE: 'Incorrect passphrase',
  USERNAME_OR_EMAIL_UNAVAILABLE:
    'Sorry, that username or email address is already in use. Please try another one.',
  USER_NOT_FOUND: 'User not found.',
} as const;
