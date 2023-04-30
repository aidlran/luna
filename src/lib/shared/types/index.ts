import type { User } from '@prisma/client';

export type IModelNoID<T extends { id: string }> = Omit<T, 'id'>;

export type IUserSanitised = Omit<User, 'passwordHash'>;
