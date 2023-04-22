import { userController } from '$lib/server/utils/context';
import type { UserCreateDTO } from '$lib/shared/dtos';
import type { RequestEvent } from './$types';

export const POST = (requestEvent) =>
  userController.post(requestEvent as RequestEvent & { request: { dto: UserCreateDTO } });
