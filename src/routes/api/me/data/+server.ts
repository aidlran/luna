import { encryptedDataController } from '$lib/server/utils/context';
import type { EncryptedDataCreateDTO } from '$lib/shared/dtos';
import type { RequestEvent } from './$types';

export const GET = (requestEvent) => encryptedDataController.getByUserIncludeKeys(requestEvent);

export const POST = (requestEvent) =>
  encryptedDataController.createForUser(
    requestEvent as RequestEvent & { request: { dto: EncryptedDataCreateDTO } },
  );
