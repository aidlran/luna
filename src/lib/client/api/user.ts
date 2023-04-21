import type { KeyPair, User } from '@prisma/client';

import type { UserCreateDTO } from '$lib/shared/dtos';
import { post } from '../utils';

export function createUser(data: UserCreateDTO) {
  return post('user', data) as Promise<{
    errors?: Record<string, string[]>;
    user?: Omit<User & { keyPairs: KeyPair[] }, 'passwordHash'>;
  }>;
}
