import type { KeyPairCreateDTO } from '$lib/shared/dtos';
import { prismaClient } from '../utils/context';

// TODO: replace with controller/service classes

/** @deprecated */
export async function userHasKey(userId: string) {
  try {
    await prismaClient.userKeyPair.findFirstOrThrow({
      where: {
        userId,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

/** @deprecated */
export async function createUserKeyPair(userID: string, keyPairDTO: KeyPairCreateDTO) {
  const userKeyPair = await prismaClient.userKeyPair.create({
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
