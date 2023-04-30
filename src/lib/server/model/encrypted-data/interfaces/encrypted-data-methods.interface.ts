import type { EncryptedData } from '@prisma/client';

/** Provides JSdoc comments on shared methods. */
export interface IEncryptedDataMethods {
  /**
   * Get encrypted data item by ID with user's key(s) for it.
   *
   * #### Throws:
   * - `NotFoundError`: if encrypted data item is not found.
   * - `PermissionDeniedError`: if user has no key for the data.
   */
  getByIdIncludeKeysForUser: (encryptedDataID: string, userID: string) => Promise<EncryptedData>;

  /**
   * Get user's encrypted data items with key(s) for each.
   */
  getByUserIncludeKeys(userID: string): Promise<EncryptedData[]>;
}
