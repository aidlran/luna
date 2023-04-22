import { encryptedDataController } from '$lib/server/utils/context';
import type { RequestEvent } from './$types';

export const GET = (requestEvent: RequestEvent) => encryptedDataController.getOne(requestEvent);
