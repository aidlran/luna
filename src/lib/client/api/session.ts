import type { KeyPair, User } from '@prisma/client';

import type { SessionCreateDTO } from '$lib/shared';
import { post } from '../utils';

export function createSession(data: SessionCreateDTO) {
  return post('session', data) as Promise<{
    message?: string;
    user?: Omit<User & { userKeyPairs: { keyPair: KeyPair }[] }, 'passwordHash'>;
  }>;
}
