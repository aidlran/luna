import type { EncryptedData } from '@prisma/client';
import type { EncryptedDataKeyJoin } from './encrypted-data-keys-join.interface';

export interface EncryptedDataWithKeysQueryResult extends EncryptedData {
  encryptedDataKeys: EncryptedDataKeyJoin[];
}
