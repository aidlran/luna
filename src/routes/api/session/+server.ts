import type { RequestEvent } from '@sveltejs/kit';
import { sessionController } from '$lib/server/utils/context';
import type { SessionCreateDTO } from '$lib/shared/dtos';

export const POST = (requestEvent) =>
  sessionController.post(requestEvent as RequestEvent & { request: { dto: SessionCreateDTO } });
