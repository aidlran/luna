import { encryptedDataController } from '$lib/server/utils/context';

export const GET = (requestEvent) => encryptedDataController.getRootData(requestEvent);
