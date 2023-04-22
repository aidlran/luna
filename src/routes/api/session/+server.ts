import type { RequestEvent } from '@sveltejs/kit';
import { sessionController } from '$lib/server/utils/context';
import type { SessionCreateDTO, SessionDataUpdateDTO } from '$lib/shared/dtos';

export const DELETE = (requestEvent) => sessionController.delete(requestEvent);

export const GET = (requestEvent) => sessionController.get(requestEvent);

export const POST = (requestEvent) =>
  sessionController.post(requestEvent as RequestEvent & { request: { dto: SessionCreateDTO } });

export const PUT = (requestEvent) =>
  sessionController.put(requestEvent as RequestEvent & { request: { dto: SessionDataUpdateDTO } });
