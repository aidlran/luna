import { encryptedDataController } from '$lib/server/utils/context';

export const DELETE = (requestEvent) => encryptedDataController.deleteByIdAndUser(requestEvent);
export const GET = (requestEvent) => encryptedDataController.getByIdIncludeKeysForUser(requestEvent);
