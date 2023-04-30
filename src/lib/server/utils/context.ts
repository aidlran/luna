/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

import {
  EncryptedDataController,
  EncryptedDataIncludeFactory,
  EncryptedDataRepository,
  EncryptedDataService,
} from '../model/encrypted-data';

import { KeyPairService } from '../model/key-pair';
import { JwtService, SessionController, SessionService } from '../model/session';
import { UserController, UserService } from '../model/user';
import { EncryptedDataKeyRepository } from '../model/encrypted-data/repositories/encrypted-data-key.repository';

// Stop Prisma making additional connections when dev server auto-reloads
if (dev && !(global as any).prisma) {
  (global as any).prisma = new PrismaClient();
}

export const prismaClient = dev ? (global as any).prisma : new PrismaClient();

export const jwtService = new JwtService();
export const keyPairService = new KeyPairService(prismaClient);
export const encryptedDataService = new EncryptedDataService(
  new EncryptedDataRepository(prismaClient, new EncryptedDataIncludeFactory()),
  new EncryptedDataKeyRepository(prismaClient),
  keyPairService,
);
export const sessionService = new SessionService(jwtService, prismaClient);
export const userService = new UserService(prismaClient);

export const encryptedDataController = new EncryptedDataController(sessionService, encryptedDataService);
export const sessionController = new SessionController(prismaClient, sessionService, userService);
export const userController = new UserController(sessionService, userService);
