export class EncryptedDataIncludeFactory {
  public getEncryptedDataKeysIncludeForUser(userID: string) {
    return {
      encryptedDataKeys: {
        select: {
          encryptedDataKey: true,
          keyPair: {
            select: {
              userKeyPairs: { take: 1 },
            },
          },
        },
        // where key pair is connected to (owned by) the user
        where: {
          keyPair: {
            userKeyPairs: { some: { userID } },
          },
        },
      },
    };
  }
}
