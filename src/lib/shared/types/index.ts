import type { EncryptedData, User } from '@prisma/client';

export type IModelNoID<T extends { id: string }> = Omit<T, 'id'>;

export type IEncryptedDataCreate = IModelNoID<EncryptedData>;

export type IUserSanitised = Omit<User, 'passwordHash'>;
