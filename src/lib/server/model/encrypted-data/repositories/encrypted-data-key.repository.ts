import type { IEncryptedDataCreate } from '$lib/shared/interfaces';
import type { EncryptedData, EncryptedDataKey, PrismaClient } from '@prisma/client';

export class EncryptedDataKeyRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async createForExistingData(encryptedDataKey: EncryptedDataKey): Promise<EncryptedDataKey> {
    return await this.prismaClient.encryptedDataKey.create({
      data: encryptedDataKey,
    });
  }

  public async createForNewData(
    encryptedData: IEncryptedDataCreate,
  ): Promise<EncryptedDataKey & { encryptedData: EncryptedData }> {
    return await this.prismaClient.encryptedDataKey.create({
      data: {
        encryptedDataKey: encryptedData.encryptedReadKey,
        keyPair: {
          connect: {
            id: encryptedData.ownerKeyPairID,
          },
        },
        encryptedData: {
          create: {
            ownerKeyPairID: encryptedData.ownerKeyPairID,
            payload: encryptedData.payload,
          },
        },
      },
      include: {
        encryptedData: true,
      },
    });
  }
}
