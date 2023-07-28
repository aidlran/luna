import type { EncryptedData, PrismaClient, UserKeyPair } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import type { IEncryptedDataMethods } from '../interfaces/encrypted-data-methods.interface';
import { PermissionDeniedError } from '../errors/permission-denied.error';
import type { EncryptedDataWithKeysQueryResult } from '../types/encrypted-data-with-keys-query-result.interface';
import type { EncryptedDataIncludeFactory } from '../factories/encrypted-data-include.factory';
import type { IModelNoID } from '$lib/shared/types';

export class EncryptedDataRepository implements IEncryptedDataMethods {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly includeFactory: EncryptedDataIncludeFactory,
  ) {}

  public async create(data: IModelNoID<EncryptedData>): Promise<EncryptedData> {
    return await this.prismaClient.encryptedData.create({ data });
  }

  /**
   * Delete encrypted data item by ID.
   *
   * #### Throws:
   * - Prisma throws an error if encrypted data item is not found.
   */
  public async deleteByID(encryptedDataID: string): Promise<void> {
    await this.prismaClient.encryptedData.delete({
      where: {
        id: encryptedDataID,
      },
    });
  }

  /**
   * Get encrypted data item by ID.
   *
   * #### Throws:
   * - `NotFoundError`: if encrypted data item is not found.
   */
  public async getByID(encryptedDataID: string): Promise<EncryptedData> {
    const encryptedData = await this.prismaClient.encryptedData.findUnique({
      where: {
        id: encryptedDataID,
      },
    });

    // TODO: wrap prismaClient queries to auto throw these errors
    if (!encryptedData) {
      throw new NotFoundError();
    }

    return encryptedData;
  }

  public async getByIdIncludeKeysForUser(
    encryptedDataID: string,
    userID: string,
  ): Promise<EncryptedDataWithKeysQueryResult> {
    const findResult = await this.prismaClient.encryptedData.findUnique({
      where: {
        id: encryptedDataID,
      },
      include: this.includeFactory.getEncryptedDataKeysIncludeForUser(userID),
    });

    // TODO: wrap prismaClient queries to auto throw these errors
    if (!findResult) {
      throw new NotFoundError();
    }

    // Return only if user has access to a key
    for (const encryptedDataKey of findResult.encryptedDataKeys) {
      for (const userKeyPair of encryptedDataKey.keyPair.userKeyPairs) {
        if (userKeyPair.userID === userID) {
          return findResult;
        }
      }
    }

    throw new PermissionDeniedError();
  }

  public async getByIdIncludeOwner(encryptedDataID: string): Promise<
    EncryptedData & {
      ownerKeyPair: {
        userKeyPairs: UserKeyPair[];
      };
    }
  > {
    const encryptedData = await this.prismaClient.encryptedData.findUnique({
      where: {
        id: encryptedDataID,
      },
      include: {
        ownerKeyPair: {
          include: {
            userKeyPairs: { take: 1 },
          },
        },
      },
    });

    // TODO: wrap prismaClient queries to auto throw these errors
    if (!encryptedData) {
      throw new NotFoundError();
    }

    return encryptedData;
  }

  public async getByUserIncludeKeys(userID: string): Promise<EncryptedDataWithKeysQueryResult[]> {
    return await this.prismaClient.encryptedData.findMany({
      where: {
        ownerKeyPair: {
          userKeyPairs: { some: { userID } },
        },
      },
      include: this.includeFactory.getEncryptedDataKeysIncludeForUser(userID),
    });
  }

  getRootData(appID: number, userID: string) {
    return this.prismaClient.rootData
      .findUnique({
        where: {
          appID_userID: {
            appID,
            userID,
          },
        },
        include: {
          data: true,
        },
      })
      .then((rootData) => rootData?.data);
  }
}
