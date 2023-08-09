import type { PrismaClient } from '@prisma/client';
import type { IEncryptedDataCreate } from '$lib/shared/interfaces';

export class RootDataRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  create(appID: number, userID: string, data: IEncryptedDataCreate) {
    return this.prismaClient.encryptedDataKey.create({
      data: {
        encryptedDataKey: data.encryptedReadKey,
        keyPair: {
          connect: {
            id: data.ownerKeyPairID,
          },
        },
        encryptedData: {
          create: {
            ownerKeyPairID: data.ownerKeyPairID,
            payload: data.payload,
            rootDatas: {
              create: {
                // TODO: hack
                // we won't have this in backend rewrite anyway
                app: {
                  connectOrCreate: {
                    where: {
                      id: appID,
                    },
                    create: {
                      id: appID,
                      name: 'projex',
                    },
                  },
                },
                // end hack :)
                user: {
                  connect: {
                    id: userID,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  get(appID: number, userID: string) {
    return this.prismaClient.rootData
      .findUnique({
        where: {
          appID_userID: {
            appID,
            userID,
          },
        },
        select: {
          data: true,
        },
      })
      .then((rootData) => rootData?.data);
  }

  async upsert(appID: number, userID: string, data: IEncryptedDataCreate) {
    const rootData = await this.get(appID, userID);

    if (!rootData) {
      return await this.create(appID, userID, data);
    }

    const [updateResult] = await this.prismaClient.$transaction([
      this.prismaClient.rootData.update({
        where: {
          appID_userID: {
            appID,
            userID,
          },
        },
        data: {
          data: {
            create: {
              ownerKeyPairID: data.ownerKeyPairID,
              payload: data.payload,
              encryptedDataKeys: {
                create: {
                  encryptedDataKey: data.encryptedReadKey,
                  keyPairID: data.ownerKeyPairID,
                },
              },
            },
          },
        },
      }),
      this.prismaClient.encryptedData.delete({
        where: {
          id: rootData.id,
        },
      }),
    ]);

    return updateResult;
  }
}
