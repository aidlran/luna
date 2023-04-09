import { hash, verify } from 'argon2';

import { prismaClientService } from '$lib/server';
import { generateUsernameFromEmail, sanitizeUsername, UserCreateDTO, SessionCreateDTO } from '$lib/shared';

export const INCORRECT_PASSPHRASE = 'INCORRECT_PASSPHRASE';

export async function createOne(user: UserCreateDTO) {
  const passwordHash = await hash(user.passphrase);
  const email = user.email.trim().toLowerCase();
  const username = user.username?.length ? sanitizeUsername(user.username) : generateUsernameFromEmail(email);
  const { privateKey, publicKey } = user;

  if (username.length < 4) throw 'Username too short';

  const result = await prismaClientService.userKeyPair.create({
    data: {
      user: {
        create: { email, passwordHash, username },
      },
      keyPair: {
        create: { privateKey, publicKey },
      },
    },
    select: {
      user: true,
      keyPair: true,
    },
  });

  return {
    ...sanitiseUser(result.user),
    userKeyPairs: [
      {
        keyPair: result.keyPair,
      },
    ],
  };
}

export async function findOneAndVerify(sessionCreateDTO: SessionCreateDTO) {
  const foundUser = await prismaClientService.user.findFirstOrThrow({
    where: {
      OR: [{ email: sessionCreateDTO.identifier }, { username: sessionCreateDTO.identifier }],
    },
    select: {
      createdAt: true,
      updatedAt: true,
      username: true,
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      userKeyPairs: {
        select: {
          keyPair: true,
        },
      },
    },
  });

  if (!(await verify(foundUser.passwordHash, sessionCreateDTO.passphrase))) {
    throw INCORRECT_PASSPHRASE;
  }

  return sanitiseUser(foundUser);
}

/**
 * Makes sure `passwordHash` is not returned in the result.
 */
function sanitiseUser<T extends { passwordHash: string }>(user: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...sanitisedUser } = user;
  return sanitisedUser;
}
