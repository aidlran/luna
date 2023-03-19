import { prismaClientService } from '$lib/server/services';

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
