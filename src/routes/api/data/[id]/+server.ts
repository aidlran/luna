import { encryptedDataController } from '$lib/server/utils/context';
import type { EncryptedDataCreateDTO } from '$lib/shared/dtos';
import type { RequestEvent } from './$types.js';

export const DELETE = (requestEvent) => encryptedDataController.deleteByIdAndUser(requestEvent);
export const GET = (requestEvent) => encryptedDataController.getByIdIncludeKeysForUser(requestEvent);
export const PUT = (requestEvent) =>
  encryptedDataController.replaceByIdAndUser(
    requestEvent as RequestEvent & { request: { dto: EncryptedDataCreateDTO } },
  );
