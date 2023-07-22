import type { EncryptedData } from '@prisma/client';

export interface EncryptedDataWithKeysResponse extends EncryptedData {
  keys: {
    encryptedDataKey: string;
    keyPairID: string;
  }[];
}
