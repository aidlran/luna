import type { User } from '@prisma/client';

export type IUserSanitised = Omit<User, 'passwordHash'>;
