/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { JwtService, SessionController, SessionService } from '../session';
import { UserController, UserService } from '../user';
import { dev } from '$app/environment';

if (dev && !(global as any).db) {
  (global as any).db = new PrismaClient();
}

export const prismaClient = dev ? (global as any).db : new PrismaClient();
export const jwtService = new JwtService();
export const sessionService = new SessionService(jwtService, prismaClient);
export const userService = new UserService(prismaClient);
export const sessionController = new SessionController(prismaClient, sessionService, userService);
export const userController = new UserController(sessionService, userService);
