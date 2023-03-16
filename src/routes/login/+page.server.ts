import type { Actions } from './$types';

import { sessionController } from '$lib/server/feature/session';

export const actions: Actions = {
  default: sessionController.post,
};
