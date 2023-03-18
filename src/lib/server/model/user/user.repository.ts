import { hash, verify } from 'argon2';
import { prismaClientService } from '$lib/server/services/prisma-client.service';
import { generateUsernameFromEmail, sanitizeUsername } from '$lib/shared/services/username.service';
import type { UserCreateDTO } from './user.create.dto';
import type { User } from '@prisma/client';
import type { SessionCreateDTO } from '../session';

export const INCORRECT_PASSPHRASE = 'INCORRECT_PASSPHRASE';

export async function createOne(user: UserCreateDTO) {
  const passwordHash = await hash(user.passphrase);
  const email = user.email.trim().toLowerCase();
  const username = user.username?.length ? sanitizeUsername(user.username) : generateUsernameFromEmail(email);

  if (username.length < 4) throw 'Username too short';

  const createdUser = await prismaClientService.user.create({
    data: { email, passwordHash, username },
  });

  return sanitiseUser(createdUser);
}

export async function findOneAndVerify(sessionCreateDTO: SessionCreateDTO) {
  const user = await prismaClientService.user.findFirstOrThrow({
    where: {
      OR: [{ email: sessionCreateDTO.identifier }, { username: sessionCreateDTO.identifier }],
    },
  });

  if (!(await verify(user.passwordHash, sessionCreateDTO.passphrase))) {
    throw INCORRECT_PASSPHRASE;
  }

  return sanitiseUser(user);
}

function sanitiseUser(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...sanitisedUser } = user;
  return sanitisedUser;
}
