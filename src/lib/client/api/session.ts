import type { KeyPair, User } from '@prisma/client';

import type { SessionCreateDTO } from '$lib/shared/dtos';
import { post } from '../utils';

export function createSession(data: SessionCreateDTO) {
  return post('session', data) as Promise<{
    message?: string;
    user?: Omit<User & { keyPairs: KeyPair[] }, 'passwordHash'>;
  }>;
}
