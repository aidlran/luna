import { encryptedDataController } from '$lib/server/utils/context';

export const DELETE = (requestEvent) => encryptedDataController.deleteOne(requestEvent);
export const GET = (requestEvent) => encryptedDataController.getOne(requestEvent);
