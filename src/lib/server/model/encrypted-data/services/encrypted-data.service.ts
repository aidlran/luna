import type { IEncryptedDataCreate, EncryptedDataWithKeysResponse } from '$lib/shared/interfaces';
import type { EncryptedData, EncryptedDataKey } from '@prisma/client';
import type { KeyPairService } from '../../key-pair';
import { PermissionDeniedError } from '../errors/permission-denied.error';
import type { IEncryptedDataMethods } from '../interfaces/encrypted-data-methods.interface';
import type { EncryptedDataKeyRepository } from '../repositories/encrypted-data-key.repository';
import type { EncryptedDataRepository } from '../repositories/encrypted-data.repository';
import type { RootDataRepository } from '../repositories/root-data.repository';
import type { EncryptedDataWithKeysQueryResult } from '../types/encrypted-data-with-keys-query-result.interface';

export class EncryptedDataService implements IEncryptedDataMethods {
  constructor(
    private readonly encryptedDataRepository: EncryptedDataRepository,
    private readonly encryptedDataKeyRepository: EncryptedDataKeyRepository,
    private readonly rootDataRepository: RootDataRepository,
    private readonly keyPairService: KeyPairService,
  ) {}

  /**
   * Transforms the query result from the repository to a more lean object.
   * @param {EncryptedDataWithKeysQueryResult} encryptedDataItem
   * @returns {EncryptedDataWithKeysResponse}
   */
  protected prepareEncryptedDataItemForUser(
    encryptedDataItem: EncryptedDataWithKeysQueryResult,
  ): EncryptedDataWithKeysResponse {
    const { encryptedDataKeys, ...encryptedData } = encryptedDataItem;

    const keys = encryptedDataKeys.map((edk) => {
      const { encryptedDataKey } = edk;
      const { keyPairID } = edk.keyPair.userKeyPairs[0];
      return { encryptedDataKey, keyPairID };
    });

    return { ...encryptedData, keys };
  }

  public async createForUser(
    userID: string,
    encryptedDataCreate: IEncryptedDataCreate,
  ): Promise<
    EncryptedDataKey & {
      encryptedData: EncryptedData;
    }
  > {
    await this.keyPairService
      .getUserKeyPair({
        userID,
        keyPairID: encryptedDataCreate.ownerKeyPairID,
      })
      .catch(() => {
        throw new PermissionDeniedError();
      });

    return await this.encryptedDataKeyRepository.createForNewData(encryptedDataCreate);
  }

  /**
   * Delete encrypted data item if user is owner.
   *
   * #### Throws:
   * - `NotFoundError`: if encrypted data item is not found.
   * - `PermissionDeniedError`: if user does not own the data.
   */
  public async deleteByIdAndUser(encryptedDataID: string, userID: string): Promise<void> {
    const encryptedData = await this.encryptedDataRepository.getByIdIncludeOwner(encryptedDataID);

    for (const userKeyPair of encryptedData.ownerKeyPair.userKeyPairs) {
      if (userKeyPair.userID === userID) {
        await this.encryptedDataRepository.deleteByID(encryptedDataID);
      }
    }
  }

  public async getByIdIncludeKeysForUser(
    encryptedDataID: string,
    userID: string,
  ): Promise<EncryptedDataWithKeysResponse> {
    return this.prepareEncryptedDataItemForUser(
      await this.encryptedDataRepository.getByIdIncludeKeysForUser(encryptedDataID, userID),
    );
  }

  public async getByUserIncludeKeys(userID: string): Promise<EncryptedDataWithKeysResponse[]> {
    return (await this.encryptedDataRepository.getByUserIncludeKeys(userID)).map((encryptedDataItem) =>
      this.prepareEncryptedDataItemForUser(encryptedDataItem),
    );
  }

  createRootData(appID: number, userID: string, data: IEncryptedDataCreate) {
    return this.rootDataRepository.create(appID, userID, data);
  }

  getRootData(appID: number, userID: string) {
    return this.rootDataRepository.get(appID, userID);
  }

  upsertRootData(appID: number, userID: string, data: IEncryptedDataCreate) {
    return this.rootDataRepository.upsert(appID, userID, data);
  }
}
