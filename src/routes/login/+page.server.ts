import type { Actions } from './$types';

import { sessionController } from '$lib/server/model/session';

export const actions: Actions = {
  default: sessionController.post,
};
