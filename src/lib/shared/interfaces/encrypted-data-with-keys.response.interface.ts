import type { EncryptedData } from '@prisma/client';

export interface EncryptedDataWithKeysResponse extends EncryptedData {
  keys: Array<{
    encryptedDataKey: string;
    keyPairID: string;
  }>;
}
