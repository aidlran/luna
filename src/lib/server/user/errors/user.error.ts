import { USER_ERROR_MESSAGES } from '../constants/user-error-messages.constant';
import type { UserErrorCode } from '../types/user-error-code.type';

export class UserError extends Error {
  constructor(public readonly name: UserErrorCode) {
    super(USER_ERROR_MESSAGES[name]);
  }
}
