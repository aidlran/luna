import type { PrismaClient, UserKeyPair } from '@prisma/client';

export class KeyPairService {
  constructor(private readonly prismaClient: PrismaClient) {}

  /**
   * Get a unique UserKeyPair compound item.
   * Useful for seeing if a User owns a KeyPair.
   * @param {UserKeyPair} userKeyPair
   * @returns {Promise<UserKeyPair>}
   */
  public getUserKeyPair(userKeyPair: UserKeyPair): Promise<UserKeyPair> {
    return this.prismaClient.userKeyPair.findUniqueOrThrow({
      where: {
        keyPairId_userId: userKeyPair,
      },
    });
  }
}
