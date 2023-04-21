import type { RequestEvent } from '@sveltejs/kit';
import { userController } from '$lib/server/utils/context';
import type { UserCreateDTO } from '$lib/shared/dtos';

export const POST = (requestEvent) =>
  userController.post(requestEvent as RequestEvent & { request: { dto: UserCreateDTO } });
