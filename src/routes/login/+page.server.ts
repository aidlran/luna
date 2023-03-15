import type { Actions } from '@sveltejs/kit';

import { sessionController } from '$lib/server/feature/session';

export const actions: Actions = {
  default: sessionController.post,
};
