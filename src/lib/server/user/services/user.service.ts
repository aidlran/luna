import { hash, verify } from 'argon2';
import type { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { IUserCreate, IUserMe } from '$lib/shared/interfaces';
import { UserError } from '../errors/user.error';

export class UserService {
  constructor(private readonly prismaClient: PrismaClient) {}

  /**
   * Creates a user.
   * @param {IUserCreate} user Data required to create a user.
   * @returns {Promise<IUserMe>} A promise that fulfils with the created user and additional relevant data.
   */
  public async create(user: IUserCreate): Promise<IUserMe> {
    const email = user.email.trim().toLowerCase();
    const username = user.username.trim().toLowerCase();

    const passwordHash = await hash(user.passphrase);

    const { privateKey, publicKey } = user;

    let result;

    try {
      result = await this.prismaClient.userKeyPair.create({
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
    } catch (e) {
      throw e instanceof PrismaClientKnownRequestError && e.code === 'P2002'
        ? new UserError('USERNAME_OR_EMAIL_UNAVAILABLE')
        : e;
    }

    return {
      ...this.sanitise(result.user),
      keyPairs: [result.keyPair],
    };
  }

  /**
   * Finds a user and verifies the given passphrase.
   * @param {string} identifier The user's email address or username.
   * @param {string} passphrase The user's passphrase.
   * @returns {Promise<IUserMe>} A promise that resolves with the user.
   */
  public async findAndVerify(identifier: string, passphrase: string): Promise<IUserMe> {
    const result = await this.prismaClient.userKeyPair.findMany({
      where: {
        user: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      },
      select: {
        user: true,
        keyPair: true,
      },
    });

    if (result.length < 1) {
      throw new UserError('USER_NOT_FOUND');
    }

    if (!(await verify(result[0].user.passwordHash, passphrase))) {
      throw new UserError('INCORRECT_PASSPHRASE');
    }

    return {
      ...this.sanitise(result[0].user),
      keyPairs: result.map((userKeyPair) => {
        return { ...userKeyPair.keyPair };
      }),
    };
  }

  /**
   * Removes `passwordHash` from the object.
   * @param {T} user An object with `passwordHash`.
   * @returns {Omit<T, 'passwordHash'>} The object without `passwordHash`.
   */
  private sanitise<T extends { passwordHash: unknown }>(user: T): Omit<T, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitisedUser } = user;
    return sanitisedUser;
  }
}
