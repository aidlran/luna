import { hash } from 'argon2';
import { prismaClientService } from '$lib/server/shared/prisma-client.service';
import { generateUsernameFromEmail, sanitizeUsername } from '$lib/shared/services/username.service';
import type { UserCreateDTO } from './user.create.dto';

export async function createOne(user: UserCreateDTO) {
  const passwordHash = await hash(user.passphrase);
  const email = user.email.trim().toLowerCase();
  const username = user.username?.length ? sanitizeUsername(user.username) : generateUsernameFromEmail(email);

  if (username.length < 4) throw 'Username too short';

  return prismaClientService.user.create({
    data: { email, passwordHash, username },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      userKeyPairs: {
        select: {
          keyPair: true,
        },
      },
    },
  });
}
