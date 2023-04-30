import type { UserKeyPair } from '@prisma/client';

export interface EncryptedDataKeyJoin {
  encryptedDataKey: string;
  keyPair: {
    userKeyPairs: UserKeyPair[];
  };
}
