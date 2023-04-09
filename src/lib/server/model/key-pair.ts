import { prismaClientService } from '$lib/server/services';
import type { KeyPairCreateDTO } from '$lib/shared';

/**
 * @returns TRUE if we can find at least one keypair for the user, or FALSE otherwise.
 */
export async function userHasKey(userId: string) {
  try {
    await prismaClientService.userKeyPair.findFirstOrThrow({
      where: {
        userId,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function createUserKeyPair(userID: string, keyPairDTO: KeyPairCreateDTO) {
  const userKeyPair = await prismaClientService.userKeyPair.create({
    data: {
      user: {
        connect: {
          id: userID,
        },
      },
      keyPair: {
        create: {
          privateKey: keyPairDTO.privateKey,
          publicKey: keyPairDTO.publicKey,
        },
      },
    },
    select: {
      keyPair: true,
    },
  });

  return userKeyPair.keyPair;
}
