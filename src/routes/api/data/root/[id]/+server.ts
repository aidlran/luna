import { encryptedDataController } from '$lib/server/utils/context';
import type { EncryptedDataCreateDTO } from '$lib/shared/dtos';
import type { RequestEvent } from './$types.js';

export const GET = (requestEvent) => encryptedDataController.getRootData(requestEvent);
export const POST = (requestEvent) =>
  encryptedDataController.updateRootData(
    requestEvent as RequestEvent & { request: { dto: EncryptedDataCreateDTO } },
  );
