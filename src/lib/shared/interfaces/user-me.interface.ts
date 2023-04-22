import type { KeyPair } from '@prisma/client';
import type { IUserSanitised } from '../types';

/**
 * An active user's user data.
 */
export interface IUserMe extends IUserSanitised {
  keyPairs: KeyPair[];
}
